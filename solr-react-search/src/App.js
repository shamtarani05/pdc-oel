import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import BookCard from './components/BookCard';
import Pagination from './components/Pagination';

// Solr API base URL (using proxy from package.json)
const SOLR_URL = '/solr/books/select';

function App() {
  // State management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState({ categories: [], publishers: [] });
  const [highlighting, setHighlighting] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Filters and sorting
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Build Solr query URL
  const buildQueryUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Base query
    params.append('q', query || '*:*');
    params.append('defType', 'edismax');
    params.append('qf', 'title^3 author^2 description category');

    // Pagination
    params.append('start', (currentPage - 1) * rowsPerPage);
    params.append('rows', rowsPerPage);

    // Sorting
    if (sortBy === 'price_asc') {
      params.append('sort', 'price asc');
    } else if (sortBy === 'price_desc') {
      params.append('sort', 'price desc');
    } else if (sortBy === 'year_desc') {
      params.append('sort', 'year desc');
    } else if (sortBy === 'title_asc') {
      params.append('sort', 'title asc');
    }

    // Filters
    if (selectedCategories.length > 0) {
      const categoryFilter = selectedCategories.map(c => `"${c}"`).join(' OR ');
      params.append('fq', `category:(${categoryFilter})`);
    }

    if (selectedPublishers.length > 0) {
      const publisherFilter = selectedPublishers.map(p => `"${p}"`).join(' OR ');
      params.append('fq', `publisher:(${publisherFilter})`);
    }

    if (priceRange.min || priceRange.max) {
      const min = priceRange.min || '0';
      const max = priceRange.max || '*';
      params.append('fq', `price:[${min} TO ${max}]`);
    }

    if (inStockOnly) {
      params.append('fq', 'in_stock:true');
    }

    // Faceting
    params.append('facet', 'true');
    params.append('facet.field', 'category');
    params.append('facet.field', 'publisher');
    params.append('facet.mincount', '1');

    // Highlighting
    params.append('hl', 'true');
    params.append('hl.fl', 'title,description');
    params.append('hl.simple.pre', '<mark>');
    params.append('hl.simple.post', '</mark>');

    // Response format
    params.append('wt', 'json');

    return `${SOLR_URL}?${params.toString()}`;
  }, [query, currentPage, rowsPerPage, sortBy, selectedCategories, selectedPublishers, priceRange, inStockOnly]);

  // Fetch results from Solr
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const url = buildQueryUrl();
      const response = await axios.get(url);
      const data = response.data;

      // Extract results
      setResults(data.response.docs);
      setTotalResults(data.response.numFound);

      // Extract facets
      if (data.facet_counts && data.facet_counts.facet_fields) {
        const categoryFacets = [];
        const publisherFacets = [];

        const catArray = data.facet_counts.facet_fields.category || [];
        for (let i = 0; i < catArray.length; i += 2) {
          if (catArray[i + 1] > 0) {
            categoryFacets.push({ name: catArray[i], count: catArray[i + 1] });
          }
        }

        const pubArray = data.facet_counts.facet_fields.publisher || [];
        for (let i = 0; i < pubArray.length; i += 2) {
          if (pubArray[i + 1] > 0) {
            publisherFacets.push({ name: pubArray[i], count: pubArray[i + 1] });
          }
        }

        setFacets({ categories: categoryFacets, publishers: publisherFacets });
      }

      // Extract highlighting
      if (data.highlighting) {
        setHighlighting(data.highlighting);
      }

    } catch (error) {
      console.error('Error fetching from Solr:', error);
      // For demo, show mock data if Solr is not running
      setResults([]);
      setTotalResults(0);
    }
    setLoading(false);
  }, [buildQueryUrl]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategories, selectedPublishers, priceRange, inStockOnly, sortBy]);

  // Handle search
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  // Handle category filter toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle publisher filter toggle
  const handlePublisherToggle = (publisher) => {
    setSelectedPublishers(prev =>
      prev.includes(publisher)
        ? prev.filter(p => p !== publisher)
        : [...prev, publisher]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPublishers([]);
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
  };

  // Total pages calculation
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Book Search Engine</h1>
        <p>Powered by Apache Solr - CS-347 Lab 13</p>
      </header>

      {/* Search Container */}
      <div className="search-container">
        <SearchBar
          onSearch={handleSearch}
          initialQuery={query}
        />

        {/* Sort and Results Count */}
        <div className="sort-container">
          <span className="results-count" style={{ color: '#374151' }}>
            Found <strong>{totalResults}</strong> books
          </span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Newest First</option>
            <option value="title_asc">Title: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Filters */}
        <Filters
          facets={facets}
          selectedCategories={selectedCategories}
          selectedPublishers={selectedPublishers}
          priceRange={priceRange}
          inStockOnly={inStockOnly}
          onCategoryToggle={handleCategoryToggle}
          onPublisherToggle={handlePublisherToggle}
          onPriceRangeChange={setPriceRange}
          onInStockToggle={() => setInStockOnly(!inStockOnly)}
          onClearFilters={clearFilters}
        />

        {/* Results */}
        <div className="results-container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  highlighting={highlighting[book.id]}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="no-results">
              <h3>No books found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
