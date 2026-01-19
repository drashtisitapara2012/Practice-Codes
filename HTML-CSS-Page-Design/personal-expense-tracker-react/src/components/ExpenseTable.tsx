import ExpenseRow from "./ExpenseRow";
import type{ Expense } from "../types/expense";

type Props = {
  expenses: Expense[];
  onDelete: (id: number) => void;
};

export default function ExpenseTable({ expenses, onDelete }:Props) {
  if (!expenses.length) {
    return <p style={{ textAlign: "center" }}>No expenses found</p>;
  }

  return (
    <table id="expenseTable">
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <ExpenseRow
            key={exp.id}
            expense={exp}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
