import { useState, useEffect } from "react";
import { useTodos } from "../../context/TodoContext";

const Pagination = () => {
  const { currentPage, setCurrentPage, totalPages, totalItems } = useTodos();
  const [inputPage, setInputPage] = useState(currentPage);

  // Sync input value when currentPage changes externally (e.g. filtered buttons)
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow empty string to let user clear input
    if (value === "") {
      setInputPage("");
      return;
    }
    // Only allow numbers
    if (/^\d+$/.test(value)) {
      setInputPage(Number(value));
    }
  };

  const handlePageSubmit = () => {
    let pageNumber = Number(inputPage);

    // Default to 1 if invalid or empty
    if (!pageNumber || pageNumber < 1) pageNumber = 1;
    // Cap at totalPages
    if (pageNumber > totalPages) pageNumber = totalPages;

    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If valid but same page, just reset input to look nice
      setInputPage(currentPage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageSubmit();
      e.target.blur(); // Remove focus after submit
    }
  };

  return (
    <div className="my-10 flex flex-col items-center gap-4">
      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex h-[38px] items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-sm font-bold text-white shadow transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-[1px] disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          ← Previous
        </button>

        {/* Info Box */}
        <div className="flex flex-col items-center bg-white px-6 py-2 rounded-lg border border-slate-200 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-indigo-300">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span>Page</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handlePageSubmit}
              onKeyDown={handleKeyDown}
              className="w-12 text-center rounded border border-slate-300 px-1 py-0.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
              aria-label="Current Page"
            />
            <span>of {totalPages}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {totalItems} items total
          </span>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex h-[38px] items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-sm font-bold text-white shadow transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-[1px] disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
