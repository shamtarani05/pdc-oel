import React from 'react';

function BookCard({ book, highlighting }) {
  // Get highlighted content or fallback to original
  const getHighlightedContent = (field) => {
    if (highlighting && highlighting[field] && highlighting[field].length > 0) {
      return highlighting[field][0];
    }
    return book[field] || '';
  };

  const title = getHighlightedContent('title');
  const description = getHighlightedContent('description');

  return (
    <div className="book-card">
      <div className="book-info">
        {/* Title with highlighting */}
        <h3 dangerouslySetInnerHTML={{ __html: title }} />

        {/* Author */}
        <p className="book-author">by {book.author}</p>

        {/* Description with highlighting */}
        <p
          className="book-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Meta tags */}
        <div className="book-meta">
          <span className="meta-tag category">{book.category}</span>
          <span className="meta-tag">{book.publisher}</span>
          <span className="meta-tag">{book.year}</span>
          <span className="meta-tag">{book.pages} pages</span>
          {book.isbn && <span className="meta-tag">ISBN: {book.isbn}</span>}
        </div>
      </div>

      {/* Price and Stock */}
      <div className="book-price">
        <div className="price-value">${book.price?.toFixed(2)}</div>
        <div className={`stock-status ${book.in_stock ? 'in-stock' : 'out-of-stock'}`}>
          {book.in_stock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
