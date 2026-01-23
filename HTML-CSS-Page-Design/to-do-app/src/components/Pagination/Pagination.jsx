import { useState, useEffect } from "react";
import { useTodos } from "../../context/TodoContext";

const Pagination = () => {
  const { currentPage, setCurrentPage, totalPages, totalItems } = useTodos();
  const [inputPage, setInputPage] = useState(currentPage);

  // Sync input when page changes externally
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

    if (value === "") {
      setInputPage("");
      return;
    }

    if (/^\d+$/.test(value)) {
      setInputPage(Number(value));
    }
  };

  const handlePageSubmit = () => {
    let page = Number(inputPage);

    if (!page || page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    setCurrentPage(page);
    setInputPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageSubmit();
      e.target.blur();
    }
  };

  return (
    <div className="my-8 px-4">
      {/* Wrapper */}
      <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-full sm:w-auto h-[40px] rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-sm font-semibold text-white shadow transition
          disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          ← Previous
        </button>

        {/* Info Box */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span>Page</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handlePageSubmit}
              onKeyDown={handleKeyDown}
              className="w-12 text-center rounded border border-slate-300 bg-slate-50 px-1 py-0.5 text-sm
              focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Current Page"
            />
            <span>of {totalPages}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            {totalItems} items total
          </span>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-full sm:w-auto h-[40px] rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-sm font-semibold text-white shadow transition
          disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
