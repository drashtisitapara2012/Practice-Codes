import { useState } from "react";
import { useTodos } from "../../context/TodoContext";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const TodoItem = ({ todo, onEdit }) => {
  const { deleteTodo, toggleTodo } = useTodos();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


  console.log("Rendered TodoItem", todo);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  return (
    <li className={`flex flex-col gap-2 p-3 mb-4 rounded-xl border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out
      bg-gradient-to-br from-white to-[#f8f9fb]
      animate-slideIn
    ${todo.completed ? "opacity-70 bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8]" : ""}
      hover:shadow-[0_8px_25px_rgba(102,126,234,0.08)] hover:border-[#b8d4e8] hover:-translate-y-[2px]
      `}>

      <div className="flex items-start justify-between gap-3">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-1">
          {/* Title row */}
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              className={`font-semibold text-base text-gray-800 transition-all ${todo.completed ? "line-through text-gray-400" : ""
                }`}
            >
              {todo.title}
            </span>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="text-sm text-gray-500 pl-5 md:pl-8">
              {todo.description}
            </p>
          )}

          {/* Priority & Due Date BELOW title */}
          {(todo.priority || todo.dueDate) && (
            <div className="flex flex-wrap gap-3 text-xs pl-5 md:pl-8">
              {todo.priority && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${todo.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : todo.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                >
                  {todo.priority}
                </span>
              )}

              {todo.dueDate && (
                <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {todo.dueDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-2 pt-1">
          {!todo.completed && (
            <button
              onClick={() => onEdit(todo)}
              className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_12px_rgba(102,126,234,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[2px]"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          )}

          <button
            onClick={handleDeleteClick}
            className={`flex items-center justify-center w-7 h-7 rounded-md text-white transition-all duration-300 ease-in-out
        ${todo.completed
                ? "bg-gradient-to-br from-green-500 to-green-600"
                : "bg-gradient-to-br from-red-500 to-red-600"
              }`}
            title={todo.completed ? "Clean Up" : "Delete"}
          >
            {todo.completed ? <FaCheck size={14} /> : <FaTrash size={14} />}
          </button>
        </div>
      </div>


      {/* Confirmation dialog for delete */}
      {showConfirmDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white border-2 border-red-500 rounded-xl p-5 shadow-[0_10px_30px_rgba(255,107,107,0.15)] 
                  z-50 min-w-[280px] max-w-[90%] text-center">
          <p className="mb-4 text-gray-800 text-sm leading-relaxed">
            Are you sure you want to {todo.completed ? "clean up" : "delete"} this TODO: <br />
            <span className="font-semibold">{todo.title}</span>?
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              className="min-w-[90px] h-9 text-sm font-semibold rounded-md bg-gradient-to-br from-[#ffccb3] to-[#ffb399] text-[#6d4c41] shadow-[0_4px_12px_rgba(255,184,153,0.25)] 
                   hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(255,184,153,0.35)] transition"
              onClick={() => {
                deleteTodo(todo.id);
                setShowConfirmDelete(false);
              }}
            >
              {todo.completed ? "Clean Up" : "Yes, Delete"}
            </button>
            <button
              className="min-w-[90px] h-9 text-sm font-semibold rounded-md border border-gray-300 bg-gray-100 text-gray-800 
                   hover:bg-gray-200 hover:-translate-y-[1px] transition"
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
