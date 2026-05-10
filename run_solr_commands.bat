@echo off
echo ========================================================================
echo           APACHE SOLR - LAB 13 AUTOMATED SETUP
echo           CS-347: Open Ended Lab
echo ========================================================================
echo.

set SOLR_PATH=C:\Users\Sham\Downloads\solr-9.10.1\solr-9.10.1
set DATASET_PATH=C:\Users\Sham\Downloads\project dl\pdc oel\dataset\books.json

echo [1/6] Checking if Solr is running...
curl -s http://localhost:8983/solr/admin/cores?action=STATUS >nul 2>&1
if %errorlevel%==0 (
    echo      Solr is already running!
) else (
    echo      Starting Solr server...
    cd /d "%SOLR_PATH%"
    call bin\solr start
    timeout /t 10 /nobreak >nul
)
echo.

echo [2/6] Creating 'books' core...
cd /d "%SOLR_PATH%"
call bin\solr create -c books 2>nul
echo      Core 'books' ready!
echo.

echo [3/6] Adding schema fields...
echo      Adding title field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"title\",\"type\":\"text_general\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding author field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"author\",\"type\":\"text_general\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding category field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"category\",\"type\":\"string\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding price field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"price\",\"type\":\"pfloat\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding year field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"year\",\"type\":\"pint\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding publisher field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"publisher\",\"type\":\"string\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding description field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"description\",\"type\":\"text_general\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding isbn field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"isbn\",\"type\":\"string\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding pages field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"pages\",\"type\":\"pint\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding language field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"language\",\"type\":\"string\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Adding in_stock field...
curl -s -X POST -H "Content-type:application/json" --data-binary "{\"add-field\":{\"name\":\"in_stock\",\"type\":\"boolean\",\"stored\":true,\"indexed\":true}}" http://localhost:8983/solr/books/schema >nul

echo      Schema fields added!
echo.

echo [4/6] Indexing books dataset...
cd /d "%SOLR_PATH%"
call bin\post -c books "%DATASET_PATH%"
echo      Dataset indexed!
echo.

echo [5/6] Running sample queries...
echo.
echo ========================================================================
echo QUERY 1: Get all documents
echo URL: http://localhost:8983/solr/books/select?q=*:*
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=*:*&rows=3&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 2: Search by title (algorithms)
echo URL: http://localhost:8983/solr/books/select?q=title:algorithms
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=title:algorithms&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 3: Filter by category
echo URL: http://localhost:8983/solr/books/select?q=*:*^&fq=category:"Computer Science"
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=*:*&fq=category:\"Computer Science\"&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 4: Sort by price ascending
echo URL: http://localhost:8983/solr/books/select?q=*:*^&sort=price asc
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=*:*&sort=price%%20asc&rows=5&fl=title,price&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 5: Faceted search by category
echo URL: http://localhost:8983/solr/books/select?q=*:*^&facet=true^&facet.field=category
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=*:*&facet=true&facet.field=category&rows=0&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 6: Highlighting search terms
echo URL: http://localhost:8983/solr/books/select?q=programming^&hl=true^&hl.fl=description
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=programming&hl=true&hl.fl=description&wt=json&indent=true" 2>nul
echo.
echo.

echo ========================================================================
echo QUERY 7: Price range filter
echo URL: http://localhost:8983/solr/books/select?q=*:*^&fq=price:[0 TO 50]
echo ========================================================================
curl -s "http://localhost:8983/solr/books/select?q=*:*&fq=price:[0%%20TO%%2050]&fl=title,price&wt=json&indent=true" 2>nul
echo.
echo.

echo [6/6] Opening Solr Admin Interface...
start http://localhost:8983/solr/#/books/query
echo.

echo ========================================================================
echo                    SETUP COMPLETE!
echo ========================================================================
echo.
echo Solr Admin URL: http://localhost:8983/solr/
echo Books Core URL: http://localhost:8983/solr/#/books
echo Query Interface: http://localhost:8983/solr/#/books/query
echo.
echo IMPORTANT URLs to take screenshots:
echo.
echo 1. Solr Dashboard:
echo    http://localhost:8983/solr/
echo.
echo 2. Core Overview:
echo    http://localhost:8983/solr/#/books
echo.
echo 3. Schema Fields:
echo    http://localhost:8983/solr/#/books/schema
echo.
echo 4. Query - All Documents:
echo    http://localhost:8983/solr/books/select?q=*:*
echo.
echo 5. Query - Faceted Search:
echo    http://localhost:8983/solr/books/select?q=*:*^&facet=true^&facet.field=category
echo.
echo 6. Query - Highlighting:
echo    http://localhost:8983/solr/books/select?q=programming^&hl=true^&hl.fl=description
echo.
echo ========================================================================
pause
