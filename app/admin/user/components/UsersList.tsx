import React, { useState, useEffect } from 'react';
import { getUsers } from "@/modules/user/user.endpoint"; // Import your API function
import { RecordStatus } from "@/modules/common/common.types"; // Adjust the import path as necessary

const UsersList: React.FC = () => {
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [users, setUsers] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch users on status, pageNumber, or searchTerm change
  useEffect(() => {
    setIsLoading(true);
    getUsers(status, pageNumber)
      .then((res: any) => {
        setUsers(res.users);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setError("Failed to fetch users.");
        setIsLoading(false);
      });
  }, [status, pageNumber, searchTerm]);

  // Handle next page
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(prevPage => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prevPage => prevPage - 1);
    }
  };

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(1); // Reset to page 1 when search term changes
  };

  return (
    <div>
      {/* Search by Term */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      {/* Users List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div>
        <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
          Previous
        </button>
        <span>Page {pageNumber} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={pageNumber === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
