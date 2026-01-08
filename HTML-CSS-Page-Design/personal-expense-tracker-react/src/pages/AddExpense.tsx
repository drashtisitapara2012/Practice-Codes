import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Expense } from "../types/expense";
import { addExpense as addToDb, updateExpense as updateInDb } from "../api/indexedDb";
import { getAllExpenses } from "../api/indexedDb";


const DEFAULT_CATEGORIES = ["bill", "food", "shopping", "travel"];

// Allow English letters, numbers, spaces & common symbols
const VALID_TEXT_REGEX = /^[A-Za-z0-9 _.,-]+$/;

const normalize = (v: string) => v.trim().toLowerCase();

export default function AddExpense() {
  const navigate = useNavigate();

 const [expenses, setExpenses] = useState<Expense[]>([]);
useEffect(() => {
  const loadExpenses = async () => {
    const data = await getAllExpenses();
    setExpenses(data);
  };
  loadExpenses();
}, []);


  const editId = localStorage.getItem("editExpenseId");

  const clearError = (field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };


  // Load categories from localStorage (case-insensitive persistence)
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

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

          // ensure category exists in dropdown (case-insensitive)
          if (!categories.some(cat => normalize(cat) === normalizedCategory)) {
            setCategories(prev => {
              const updated = [...prev, normalizedCategory];
              localStorage.setItem("categories", JSON.stringify(updated));
              return updated;
            });
          }
        }
      }
    }
  }, [editId, expenses]);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Item is required";
    } else if (!VALID_TEXT_REGEX.test(title)) {
      newErrors.title = "Only English characters allowed";
    } else if (title.length < 3 || title.length > 50) {
      newErrors.title = "Item must be 3–100 characters";
    }

    if (amount === "" || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (category === "custom") {
      if (!customCategory.trim()) {
        newErrors.customCategory = "Custom category is required";
      } else if (!VALID_TEXT_REGEX.test(customCategory)) {
        newErrors.customCategory = "Only English characters allowed";
      } else if (customCategory.length < 3 || customCategory.length > 30) {
        newErrors.customCategory = "Category must be 3–30 characters";
      }
    }

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory =
      category === "custom"
        ? normalize(customCategory)
        : normalize(category);

    //  Add custom category once
    const exists = categories.some(cat => normalize(cat) === finalCategory);
    if (!exists) {
      const updatedCategories = [...categories, finalCategory];
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }

    if (editId) {
      const updatedExpense: Expense = {
        id: Number(editId),
        title,
        amount: Number(amount),
        category: finalCategory,
        date,
      };

      await updateInDb(updatedExpense);
      setExpenses(prev =>
        prev.map(exp => (exp.id === Number(editId) ? updatedExpense : exp))
      );
      localStorage.removeItem("editExpenseId");
    } else {
      const newExp: Expense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category: finalCategory,
        date,
      };

      await addToDb(newExp);
      setExpenses(prev => [...prev, newExp]);
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
        <label>Item Name</label>
        <input
          type="text"
          value={title}
          maxLength={50}
          className={errors.title ? "error-input" : ""}
          placeholder="Eg: Electricity Bill"
          onChange={e => {
            setTitle(e.target.value);
            clearError("title");
          }}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          className={errors.amount ? "error-input" : ""}
          placeholder="Eg: 1500"
          onChange={e => {
            setAmount(e.target.value === "" ? "" : Number(e.target.value));
            clearError("amount");
          }}
        />
        {errors.amount && <p className="error-text">{errors.amount}</p>}

        <label>Category</label>
        <select
          value={category}
          className={errors.category ? "error-input" : ""}
          onChange={e => {
            setCategory(e.target.value);
            clearError("category");
          }}
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

        {category === "custom" && (
          <>
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              maxLength={30}
              className={errors.customCategory ? "error-input" : ""}
              onChange={e => {
                setCustomCategory(e.target.value);
                clearError("customCategory");
              }}
            />
            {errors.customCategory && (
              <p className="error-text">{errors.customCategory}</p>
            )}
          </>
        )}

        <label>Date</label>
        <input
          type="date"
          value={date}
          className={errors.date ? "error-input" : ""}
          onChange={e => {
            setDate(e.target.value);
            clearError("date");
          }}
          min={new Date(
            new Date().setFullYear(new Date().getFullYear() - 5)
          )
            .toISOString()
            .split("T")[0]
          }

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
