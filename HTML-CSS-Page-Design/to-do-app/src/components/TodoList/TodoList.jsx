import { useTodos } from "../../context/TodoContext";
import TodoItem from "../TodoItem/TodoItem";
import Pagination from "../Pagination/Pagination";
import "./TodoList.css";

const TodoList = ({ onEdit }) => {
  const { paginatedTodos, filteredTodos } = useTodos();

  // Calculate summary based on filtered todos (not paginated)
  const total = filteredTodos.length;
  const completed = filteredTodos.filter((todo) => todo.completed).length;
  const remaining = total - completed;

  if (total === 0) {
    return <p className="no-todos">No TODOs found</p>;
  }

  return (
    <div className="todo-display-card">
      {/* Summary */}
      <div className="summary-card">
        <div className="summary-item total">
          <span className="summary-label">Total</span>
          <span className="summary-value">{total}</span>
        </div>
        <div className="summary-item completed">
          <span className="summary-label">Completed</span>
          <span className="summary-value">{completed}</span>
        </div>
        <div className="summary-item remaining">
          <span className="summary-label">Remaining</span>
          <span className="summary-value">{remaining}</span>
        </div>
      </div>

      {/* Todo list */}
      <ul className="todo-list">
        {paginatedTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
        ))}
      </ul>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default TodoList;
