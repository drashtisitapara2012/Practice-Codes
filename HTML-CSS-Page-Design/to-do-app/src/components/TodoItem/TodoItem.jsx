import { useState } from "react";
import { useTodos } from "../../context/TodoContext";
import "./TodoItem.css";

const TodoItem = ({ todo, onEdit }) => {
  const { deleteTodo, toggleTodo } = useTodos();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

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
        {!todo.completed && (
          <button className="edit-btn" onClick={() => onEdit(todo)}>
            Edit
          </button>
        )}
        <button
          className={`delete-btn ${todo.completed ? "cleanup-btn" : ""}`}
          onClick={handleDeleteClick}
        >
          {todo.completed ? "Clean Up" : "Delete"}
        </button>
      </div>

      {/* Confirmation dialog for delete */}
      {showConfirmDelete && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this TODO: "{todo.title}"?</p>
          <div className="confirm-actions">
            <button
              className="confirm-btn"
              onClick={() => {
                deleteTodo(todo.id);
                setShowConfirmDelete(false);
              }}
            >
              {todo.completed ? "Clean Up" : "Yes, Delete"}
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
