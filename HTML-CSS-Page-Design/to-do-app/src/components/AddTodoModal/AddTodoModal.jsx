import { useEffect, useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";

const AddTodoModal = ({ onClose, editingTodo = null }) => {
  const { addTodo, editTodo, todos } = useTodos();

  const [title, setTitle] = useState(editingTodo?.title || "");
  const [description, setDescription] = useState(editingTodo?.description || "");
  const [priority, setPriority] = useState(editingTodo?.priority || "Medium");
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate || "");
  const [error, setError] = useState("");

  const titleRef = useRef(null);
  const MAX_DESCRIPTION_LENGTH = 100;
  const MIN_TITLE_LENGTH = 3;

  useEffect(() => {
    titleRef.current.focus();
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateForm = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required");
      return false;
    }

    if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      setError(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      return false;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setError(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
      return false;
    }

    const exists = todos.some(
      (t) =>
        t.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        t.id !== editingTodo?.id
    );

    if (exists) {
      setError("This TODO already exists");
      return false;
    }

    if (dueDate && dueDate < getTodayDate()) {
      setError("Due date cannot be in the past");
      return false;
    }

    if (!dueDate) {
      setError("Date is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const todoData = {
      title: title.trim(),
      description,
      priority,
      dueDate,
    };

    if (editingTodo) {
      editTodo(editingTodo.id, todoData);
    } else {
      addTodo({ ...todoData, completed: false });
    }

    onClose();
  };

  return (
  <div
    className="fixed inset-0 z-10 flex justify-center bg-black/30 pt-16 animate-fadeIn"
    onClick={onClose}   // ✅ close when clicking outside
  >
    <div
      className="w-[420px] rounded-xl border border-slate-300/20 bg-gradient-to-br from-white to-slate-100 p-7 shadow-xl animate-slideUp max-w-[90%]"
      onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
    >
      <h2 className="mb-5 text-[22px] font-bold text-slate-600">
        {editingTodo ? "Edit TODO" : "Add New TODO"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-semibold text-slate-500">
            Title * (min {MIN_TITLE_LENGTH} characters)
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            maxLength={100}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
          />
        </div>

        {/* Description */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-semibold text-slate-500">
            Description (max {MAX_DESCRIPTION_LENGTH} characters)
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
              setError("");
            }}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder={`Enter description (${description.length}/${MAX_DESCRIPTION_LENGTH})`}
            className="h-20 resize-none rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
          />
          <small className="mt-1 text-right text-xs text-slate-400">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </small>
        </div>

        {/* Priority */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-semibold text-slate-500">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-semibold text-slate-500">
            Due Date *
          </label>
          <input
            type="date"
            value={dueDate}
            min={getTodayDate()}
            onChange={(e) => {
              setDueDate(e.target.value);
              setError("");
            }}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mb-2 min-h-[18px] text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 min-w-[90px] rounded-md bg-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-10 min-w-[90px] rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-400/40"
          >
            {editingTodo ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AddTodoModal;
