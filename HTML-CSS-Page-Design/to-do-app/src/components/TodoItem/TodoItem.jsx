import { useState } from "react";
import { useTodos } from "../../context/TodoContext";


const TodoItem = ({ todo, onEdit }) => {
  const { deleteTodo, toggleTodo } = useTodos();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


  console.log("Rendered TodoItem", todo);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  return (
    <li className={`flex flex-col gap-3 p-5 mb-4 rounded-xl border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out
      bg-gradient-to-br from-white to-[#f8f9fb]
      animate-slideIn
    ${todo.completed ? "opacity-70 bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8]" : ""}
      hover:shadow-[0_8px_25px_rgba(102,126,234,0.08)] hover:border-[#b8d4e8] hover:-translate-y-[2px]
      `}>
      <div className="flex items-center gap-3 md:gap-3 todo-header flex-col md:flex-row">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className={`font-semibold text-base text-gray-800 transition-all ${todo.completed ? "line-through text-gray-400" : ""}`}>{todo.title}</span>
      </div>

      {todo.description && (
        <p className="test-sm text-gray-500 pl-8 md:pl-8">{todo.description}</p>
      )}

      {todo.priority || todo.dueDate ? (
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 pl-8 md:pl-8">
          {todo.priority && (
            <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full font-medium">
              {todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full font-medium">
              {todo.dueDate}
            </span>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 justify-end mt-2 md:mt-2">
        {!todo.completed && (
          <button
            onClick={() => onEdit(todo)}
            className="min-w-[70px] h-9 text-xs font-semibold rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_12px_rgba(102,126,234,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(102,126,234,0.4)] active:translate-y-0"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDeleteClick}
          className={`min-w-[70px] h-9 text-xs font-semibold rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_4px_12px_rgba(255,107,107,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] active:translate-y-0
            ${todo.completed
              ? "bg-gradient-to-br from-[#84fab0] to-[#6fd89f] text-white shadow-[0_4px_12px_rgba(132,250,176,0.3)] hover:shadow-[0_6px_16px_rgba(132,250,176,0.4)]"
              : "bg-gradient-to-br from-red-500 to-red-600 text-white hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] active:translate-y-0"
            }`}
        >
          {todo.completed ? "Clean Up" : "Delete"}
        </button>
      </div>

      {/* Confirmation dialog for delete */}
      {showConfirmDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-red-500 rounded-xl p-8 shadow-[0_20px_60px_rgba(255,107,107,0.15)] z-50 min-w-[320px] text-center">
          <p className="mb-6 text-gray-800 text-[15px] leading-relaxed">
            Are you sure you want to delete this TODO: "{todo.title}"?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="min-w-[110px] h-10 text-sm font-semibold rounded-md border-none cursor-pointer transition-all duration-300 ease-in-out
          bg-gradient-to-br from-[#ffccb3] to-[#ffb399] text-[#6d4c41] shadow-[0_4px_12px_rgba(255,184,153,0.25)]
          hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(255,184,153,0.35)]"
              onClick={() => {
                deleteTodo(todo.id);
                setShowConfirmDelete(false);
              }}
            >
              {todo.completed ? "Clean Up" : "Yes, Delete"}
            </button>
            <button
              className="min-w-[110px] h-10 text-sm font-semibold rounded-md border border-gray-300 cursor-pointer transition-all duration-300 ease-in-out
          bg-gray-100 text-gray-800 hover:bg-gray-200 hover:-translate-y-[2px]"
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
