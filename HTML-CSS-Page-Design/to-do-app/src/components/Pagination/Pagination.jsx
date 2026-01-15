import { useTodos } from "../../context/TodoContext";
import "./Pagination.css";

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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            page === "..." ? (
              <span key={`dots-${index}`} className="page-dots">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`page-number ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className="pagination-btn next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>

      <div className="pagination-summary">
        <span className="summary-text">
          Showing page {currentPage} ({totalItems} items total)
        </span>
      </div>
    </div>
  );
};

export default Pagination;
