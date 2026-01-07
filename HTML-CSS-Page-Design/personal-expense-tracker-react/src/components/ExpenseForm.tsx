import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExpenses from "../hooks/useExpense";

const predefinedCategories = ["bill", "food", "shopping", "travel"];

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { expenses, addExpense, updateExpense } = useExpenses();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Pre-fill form if editing
  useEffect(() => {
    if (!id) return;
    const expense = expenses.find((e) => e.id === Number(id));
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setDate(expense.date);
      if (predefinedCategories.includes(expense.category)) {
        setCategory(expense.category);
      } else {
        setCategory("custom");
        setCustomCategory(expense.category);
      }
    }
  }, [id, expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    const cat = category === "custom" ? customCategory.trim() : category;

    if (!title.trim() || !cat || !date || amt <= 0) {
      alert("Please enter valid values");
      return;
    }

    if (date > today) {
      alert("Future dates are not allowed");
      return;
    }

    if (id) {
      updateExpense({
        id: Number(id),
        title: title.trim(),
        amount: amt,
        category: cat,
        date,
      });
    } else {
      addExpense({
        id: Date.now(),
        title: title.trim(),
        amount: amt,
        category: cat,
        date,
      });
    }

    // Clear form
    setTitle("");
    setAmount("");
    setCategory("");
    setCustomCategory("");
    setDate("");

    navigate("/");
  };

  return (
    <div className="form-container">
      <h1>{id ? "Edit Expense" : "Add Expense"}</h1>
      <form onSubmit={handleSubmit} className="expense-form">
        <label>Item Name</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Amount</label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {predefinedCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="custom">Other (Custom)</option>
        </select>

        {category === "custom" && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <label>Date</label>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">{id ? "Update Expense" : "Add Expense"}</button>
      </form>
    </div>
  );
}
