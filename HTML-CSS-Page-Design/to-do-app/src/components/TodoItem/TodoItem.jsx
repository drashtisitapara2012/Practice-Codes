import { useTodos } from "../../context/TodoContext";
import "./TodoItem.css";

const TodoItem = ({ todo }) => {
  const { deleteTodo, toggleTodo } = useTodos();

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-header">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="todo-title">{todo.title}</span>
      </div>

      {todo.description && (
        <p className="todo-description">{todo.description}</p>
      )}

      <div className="todo-meta">
        <span>Priority: {todo.priority}</span>
        {todo.dueDate && <span>Due: {todo.dueDate}</span>}
      </div>

      <div className="todo-actions">
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </div>
    </li>

  );
};

export default TodoItem;
