import React, { useState, useEffect } from 'react';

interface PaginatedListProps<T> {
  fetchData: (pageNumber: number, searchTerm?: string) => Promise<{ items: T[], totalPages: number }>;
  renderItem: (item: T) => JSX.Element;
  searchPlaceholder?: string;
}

const PaginatedList = <T extends {}>({ fetchData, renderItem, searchPlaceholder }: PaginatedListProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    fetchData(pageNumber, searchTerm)
      .then((res) => {
        setItems(res.items);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        setIsLoading(false);
      });
  }, [pageNumber, searchTerm, fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(1); // Reset to page 1 when search term changes
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prev => prev - 1);
    }
  };

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder={searchPlaceholder || 'Search...'}
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      {/* Loading/Error States */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Render the list of items */}
          {items.map((item, index) => renderItem(item))}
        </div>
      )}

      {/* Pagination Controls */}
      <div>
        <button onClick={handlePreviousPage} disabled={pageNumber === 1}>Previous</button>
        <span>Page {pageNumber} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={pageNumber === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default PaginatedList;
