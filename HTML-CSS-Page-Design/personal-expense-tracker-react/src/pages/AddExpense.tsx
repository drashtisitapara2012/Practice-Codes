import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Expense } from "../types/expense";

const DEFAULT_CATEGORIES = ["bill", "food", "shopping", "travel"];

// Allow English letters, numbers, spaces & common symbols
const VALID_TEXT_REGEX = /^[A-Za-z0-9 _.,-]+$/;

const normalize = (v: string) => v.trim().toLowerCase();

export default function AddExpense() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
  });

  const editId = localStorage.getItem("editExpenseId");

  // ---------------- CATEGORIES ----------------
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------- EDIT MODE ----------------
  useEffect(() => {
    if (editId) {
      const exp = expenses.find(e => e.id === Number(editId));
      if (exp) {
        const normalizedCategory = normalize(exp.category);

        setTitle(exp.title);
        setAmount(exp.amount);
        setDate(exp.date);

        if (DEFAULT_CATEGORIES.includes(normalizedCategory)) {
          setCategory(normalizedCategory);
          setCustomCategory("");
        } else {
          setCategory("custom");
          setCustomCategory(exp.category);

          // Add this custom category temporarily for this session
          if (!categories.includes(normalizedCategory)) {
            setCategories(prev => [...prev, normalizedCategory]);
          }
        }
      }
    }
  }, [editId, expenses]);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Title
    if (!title.trim()) {
      newErrors.title = "Item is required";
    } else if (!VALID_TEXT_REGEX.test(title)) {
      newErrors.title = "Only English characters allowed";
    } else if (title.length < 3 || title.length > 30) {
      newErrors.title = "Item must be 3–30 characters";
    }

    // Amount
    if (amount === "" || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    // Category
    if (!category) {
      newErrors.category = "Category is required";
    }

    if (category === "custom") {
      if (!customCategory.trim()) {
        newErrors.customCategory = "Custom category is required";
      } else if (!VALID_TEXT_REGEX.test(customCategory)) {
        newErrors.customCategory = "Only English characters allowed";
      } else if (customCategory.length < 3 || customCategory.length > 20) {
        newErrors.customCategory = "Category must be 3–20 characters";
      }
    }

    // Date
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (date > today) {
        newErrors.date = "Future dates are not allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory =
      category === "custom"
        ? normalize(customCategory)
        : normalize(category);

    // Add custom category to current session list
    if (!categories.includes(finalCategory)) {
      setCategories(prev => [...prev, finalCategory]);
    }

    if (editId) {
      const updated = expenses.map(exp =>
        exp.id === Number(editId)
          ? { ...exp, title, amount: Number(amount), category: finalCategory, date }
          : exp
      );
      setExpenses(updated);
      localStorage.setItem("expenses", JSON.stringify(updated));
      localStorage.removeItem("editExpenseId");
    } else {
      const newExp: Expense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category: finalCategory,
        date,
      };
      const updated = [...expenses, newExp];
      setExpenses(updated);
      localStorage.setItem("expenses", JSON.stringify(updated));
    }

    navigate("/");
  };

  return (
    <div className="table-section">
      <div className="form-header">
        <h1>{editId ? "Edit Expense" : "Add Expense"}</h1>
        <i
          className="fa-solid fa-xmark close-icon"
          onClick={() => navigate("/")}
        ></i>
      </div>

      <form id="expenseForm" onSubmit={handleSubmit}>
        {/* TITLE */}
        <label>Item Name</label>
        <input
          type="text"
          value={title}
          className={errors.title ? "error-input" : ""}
          placeholder="Eg: Electricity Bill"
          onChange={e => setTitle(e.target.value)}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        {/* AMOUNT */}
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          className={errors.amount ? "error-input" : ""}
          placeholder="Eg: 1500"
          onChange={e =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        {errors.amount && <p className="error-text">{errors.amount}</p>}

        {/* CATEGORY */}
        <label>Category</label>
        <select
          value={category}
          className={errors.category ? "error-input" : ""}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select category</option>

          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}

          <option value="custom">Other (Custom)</option>
        </select>
        {errors.category && <p className="error-text">{errors.category}</p>}

        {/* CUSTOM CATEGORY */}
        {category === "custom" && (
          <>
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              className={errors.customCategory ? "error-input" : ""}
              onChange={e => setCustomCategory(e.target.value)}
            />
            {errors.customCategory && (
              <p className="error-text">{errors.customCategory}</p>
            )}
          </>
        )}

        {/* DATE */}
        <label>Date</label>
        <input
          type="date"
          value={date}
          className={errors.date ? "error-input" : ""}
          onChange={e => setDate(e.target.value)}
          min={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.date && <p className="error-text">{errors.date}</p>}

        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
