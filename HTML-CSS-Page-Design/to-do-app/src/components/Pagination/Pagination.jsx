import { useTodos } from "../../context/TodoContext";

const Pagination = () => {
  const { currentPage, setCurrentPage, totalPages, totalItems } = useTodos();

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

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="my-10 flex flex-col items-center gap-4">
      {/* Info */}
      <div className="text-sm font-semibold text-slate-600">
        Page {currentPage} of {totalPages}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex h-[38px] items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 text-sm font-bold text-white shadow transition disabled:bg-slate-200"
        >
          <span className="hidden sm:inline">← Previous</span>
          <span className="sm:hidden">←</span>
        </button>

        {/* Page Numbers (hidden on mobile) */}
        <div className="hidden items-center gap-2 sm:flex">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="text-slate-400 font-bold">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`h-9 w-9 rounded-lg border text-sm font-semibold
                  ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex h-[38px] items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 text-sm font-bold text-white shadow transition disabled:bg-slate-200"
        >
          <span className="hidden sm:inline">Next →</span>
          <span className="sm:hidden">→</span>
        </button>
      </div>

      {/* Summary */}
      <div className="text-xs font-semibold text-slate-600">
        {totalItems} items total
      </div>
    </div>
  );
};

export default Pagination;
