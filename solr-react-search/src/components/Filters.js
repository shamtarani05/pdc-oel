import React from 'react';

function Filters({
  facets,
  selectedCategories,
  selectedPublishers,
  priceRange,
  inStockOnly,
  onCategoryToggle,
  onPublisherToggle,
  onPriceRangeChange,
  onInStockToggle,
  onClearFilters
}) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPublishers.length > 0 ||
    priceRange.min ||
    priceRange.max ||
    inStockOnly;

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h4>Category</h4>
        {facets.categories.length > 0 ? (
          facets.categories.map((category) => (
            <label key={category.name} className="filter-option">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => onCategoryToggle(category.name)}
              />
              <span>{category.name}</span>
              <span className="filter-count">{category.count}</span>
            </label>
          ))
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No categories available</p>
        )}
      </div>

      {/* Publisher Filter */}
      <div className="filter-section">
        <h4>Publisher</h4>
        {facets.publishers.length > 0 ? (
          facets.publishers.slice(0, 6).map((publisher) => (
            <label key={publisher.name} className="filter-option">
              <input
                type="checkbox"
                checked={selectedPublishers.includes(publisher.name)}
                onChange={() => onPublisherToggle(publisher.name)}
              />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {publisher.name}
              </span>
              <span className="filter-count">{publisher.count}</span>
            </label>
          ))
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No publishers available</p>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
            style={{
              width: '80px',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          />
          <span style={{ color: '#9ca3af' }}>to</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
            style={{
              width: '80px',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="filter-section">
        <h4>Availability</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onInStockToggle}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}

export default Filters;
