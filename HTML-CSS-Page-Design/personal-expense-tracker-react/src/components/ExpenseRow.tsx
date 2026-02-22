import type{ Expense } from "../types/expense";
import { useNavigate } from "react-router-dom";


type Props = {
  expense: Expense;
  onDelete: (id: number) => void;
};

export default function ExpenseRow({ expense, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <tr>
      <td>{expense.title}</td>
      <td>{expense.amount}</td>
      <td>{expense.category}</td>
      <td>{expense.date}</td>
      <td className="actions">
        <i
          className="fa-solid fa-pen-to-square"
          onClick={() =>{
             localStorage.setItem("editExpenseId", expense.id.toString());
    navigate(`/edit/${expense.id}`);
          } }
        />
        <i
          className="fa-solid fa-trash"
          onClick={() => onDelete(expense.id)}
        />
      </td>
    </tr>
  );
}
