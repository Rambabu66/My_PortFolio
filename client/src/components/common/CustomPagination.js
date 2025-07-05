import React from "react";
import { Pagination } from "react-bootstrap";
import "./CustomPagination.css"; // Import the new CSS file

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageClick(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center ">
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'custom-disabled-prev-next' : ''}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? 'custom-disabled-prev-next' : ''}
        />
      </Pagination>
    </div>
  );
};

export default CustomPagination;