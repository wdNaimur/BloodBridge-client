import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ pages, setCurrentPage, currentPage }) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mx-auto w-fit mt-5 flex items-center gap-3">
      {/* Left Arrow */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="btn btn-circle btn-secondary btn-sm border-none shadow-none disabled:opacity-50 mr-4"
      >
        <FaArrowLeft />
      </button>

      {/* Page Buttons */}

      {pages.map((page) => (
        <button
          onClick={() => {
            setCurrentPage(page);
          }}
          key={page}
          className={`px-2 btn btn-circle btn-secondary border-none shadow-none btn-xs ${
            page === currentPage ? "bg-primary text-white" : ""
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        disabled={currentPage === pages.length - 1}
        className="btn btn-circle btn-secondary btn-sm border-none shadow-none disabled:opacity-50 ml-4"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
