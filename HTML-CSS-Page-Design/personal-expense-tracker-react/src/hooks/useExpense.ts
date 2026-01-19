import { useState, useEffect } from "react";
import type{ Expense } from "../types/expense";

export default function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const updateExpense = (updated: Expense) => {
    setExpenses(expenses.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
