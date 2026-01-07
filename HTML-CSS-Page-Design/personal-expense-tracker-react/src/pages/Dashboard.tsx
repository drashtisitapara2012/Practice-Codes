import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseChart from "../components/ExpenseChart";
import type { Expense } from "../types/expense";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Sync expenses from localStorage
  useEffect(() => {
    const data = localStorage.getItem("expenses");
    if (data) {
      setExpenses(JSON.parse(data));
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Filtering logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFrom = fromDate ? exp.date >= fromDate : true;
    const matchTo = toDate ? exp.date <= toDate : true;

    return matchSearch && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filteredExpenses.length / entriesPerPage);

  // Slice expenses for current page
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const deleteExpense = (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const editExpense = (id: number) => {
    localStorage.setItem("editExpenseId", id.toString());
    navigate("/add");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-section">
      <h1>Personal Expense Tracker</h1>

      <div className="top-bar">
        <i
          className="fas fa-plus add-icon"
          title="Add Expense"
          onClick={() => {
            localStorage.removeItem("editExpenseId");
            navigate("/add");
          }}
        ></i>
        {/* FROM DATE */}
        <div className="date-filter">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => {
              setFromDate(e.target.value);
              setToDate(""); // reset To Date if From Date changes
            }}
            min={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]}
            max={today}
          />
        </div>

        {/* TO DATE */}
        <div className="date-filter">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            min={fromDate}          
            max={today}
            disabled={!fromDate}    
          />
        </div>
        <div className={`search-wrapper ${showSearch ? "active" : ""}`}>
          <i
            className="fas fa-search search-icon"
            onClick={() => setShowSearch((v) => !v)}
          ></i>

          <input
            type="text"
            value={searchQuery}
            placeholder="Search by Title or Category"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <span
              className="search-cancel"
              onClick={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
            >
              &times;
            </span>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table id="expenseTable">
          <thead>
            <tr>
              <th>Items</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                  No expenses found
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>₹{exp.amount}</td>
                  <td>{exp.category}</td>
                  <td>{exp.date}</td>
                  <td className="actions">
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => editExpense(exp.id)}
                    ></i>
                    <i
                      className="fa-solid fa-trash"
                      onClick={() => deleteExpense(exp.id)}
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <br />
        <span id="totalExpense" className="total-expense">
          Total Expense: ₹{total}
        </span>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="chart-container">
        <h3>Expenses by Category</h3>
        <ExpenseChart expenses={filteredExpenses} />
      </div>
    </div>
  );
}
