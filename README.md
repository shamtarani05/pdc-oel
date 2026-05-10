# Lab 13: Apache Solr - Indexing, Importing and Searching Data

## CS-347 Open Ended Lab

### Project Structure

```
pdc oel/
├── dataset/
│   └── books.json              # 20 books dataset
├── solr-react-search/          # React web application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.js
│   │   │   ├── Filters.js
│   │   │   ├── BookCard.js
│   │   │   └── Pagination.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── solr_commands.txt           # All Solr commands
├── Lab_13_Report.docx          # Complete report
└── README.md
```

## Quick Start Guide

### Step 1: Start Solr
```bash
cd C:\solr-9.x.x
bin\solr start
```

### Step 2: Create Core
```bash
bin\solr create -c books
```

### Step 3: Index Data
```bash
bin\post -c books "path\to\dataset\books.json"
```

### Step 4: Configure CORS (for React integration)
Add to `server/solr-webapp/webapp/WEB-INF/web.xml`:
```xml
<filter>
  <filter-name>cross-origin</filter-name>
  <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
  <init-param>
    <param-name>allowedOrigins</param-name>
    <param-value>http://localhost:3000</param-value>
  </init-param>
  <init-param>
    <param-name>allowedMethods</param-name>
    <param-value>GET,POST,OPTIONS,DELETE,PUT,HEAD</param-value>
  </init-param>
  <init-param>
    <param-name>allowedHeaders</param-name>
    <param-value>origin, content-type, accept</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>cross-origin</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

### Step 5: Run React App
```bash
cd solr-react-search
npm install
npm start
```

## Features

### Task 1: Solr Operations
- Core creation and configuration
- Schema definition with field types
- JSON data indexing
- Search queries (basic, phrase, wildcard, fuzzy)
- Filtering and sorting
- Faceted search
- Highlighting
- Pagination

### Task 2: React Interface
- Search bar with autocomplete
- Real-time search results
- Faceted navigation (category, publisher)
- Price range filter
- Availability filter
- Multiple sorting options
- Pagination
- Highlighted search terms
- Responsive design

## Technologies Used
- Apache Solr 9.x
- React 18
- Axios
- CSS3 (Flexbox, Grid)
