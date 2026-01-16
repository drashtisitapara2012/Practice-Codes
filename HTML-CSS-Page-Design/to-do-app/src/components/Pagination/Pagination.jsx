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
      <div className="flex items-center justify-center gap-3 flex-nowrap max-[600px]:gap-2">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-400/40 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none max-[600px]:h-[38px] max-[600px]:px-3 max-[600px]:text-xs"
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-3 max-[600px]:gap-2">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="text-base font-bold text-slate-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all duration-300 max-[600px]:h-[38px] max-[600px]:w-[38px] max-[600px]:text-xs
                  ${
                    currentPage === page
                      ? "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
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
          className="flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-400/40 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none max-[600px]:h-[38px] max-[600px]:px-3 max-[600px]:text-xs"
        >
          Next →
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm font-semibold text-slate-600 max-[600px]:text-xs">
        Showing page {currentPage} ({totalItems} items total)
      </div>
    </div>
  );
};

export default Pagination;
