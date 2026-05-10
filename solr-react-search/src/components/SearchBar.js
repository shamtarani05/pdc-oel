import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SOLR_URL = '/solr/books/select';

function SearchBar({ onSearch, initialQuery }) {
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update input when initialQuery changes
  useEffect(() => {
    setInputValue(initialQuery || '');
  }, [initialQuery]);

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        q: `title:${value}* OR author:${value}*`,
        fl: 'title,author',
        rows: 5,
        wt: 'json'
      });

      const response = await axios.get(`${SOLR_URL}?${params}`);
      const docs = response.data.response.docs;

      // Extract unique suggestions
      const titleSuggestions = docs.map(d => d.title).filter(Boolean);
      const authorSuggestions = docs.map(d => d.author).filter(Boolean);
      const allSuggestions = [...new Set([...titleSuggestions, ...authorSuggestions])];

      setSuggestions(allSuggestions.slice(0, 6));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="search-input-wrapper" ref={inputRef}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for books by title, author, or topic..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions" ref={suggestionsRef}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
