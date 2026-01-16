import { useEffect, useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import "./AddTodoModal.css";

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

    // Check if title already exists (excluding current todo if editing)
    const exists = todos.some(
      (t) =>
        t.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        t.id !== editingTodo?.id
    );

    if (exists) {
      setError("This TODO already exists");
      return false;
    }

    // Validate due date is not in the past
    if (dueDate && dueDate < getTodayDate()) {
      setError("Due date cannot be in the past");
      return false;
    }
    if(!dueDate){
      setError("Date is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const todoData = {
      title: title.trim(),
      description,
      priority,
      dueDate,
    };

    if (editingTodo) {
      editTodo(editingTodo.id, todoData);
    } else {
      addTodo({
        ...todoData,
        completed: false,
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editingTodo ? "Edit TODO" : "Add New TODO"}</h2>
<form onSubmit={handleSubmit}>

  <div className="form-group">
    <label>Title * (min {MIN_TITLE_LENGTH} characters)</label>
    <input
      ref={titleRef}
      type="text"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        setError("");
      }}
      maxLength="100"
    />
  </div>

  <div className="form-group">
    <label>Description (max {MAX_DESCRIPTION_LENGTH} characters)</label>
    <textarea
      value={description}
      onChange={(e) => {
        setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
        setError("");
      }}
      maxLength={MAX_DESCRIPTION_LENGTH}
      placeholder={`Enter description (${description.length}/${MAX_DESCRIPTION_LENGTH})`}
    />
    <small className="char-count">{description.length}/{MAX_DESCRIPTION_LENGTH}</small>
  </div>

  <div className="form-group">
    <label>Priority</label>
    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  </div>

  <div className="form-group">
    <label>Due Date *</label>
    <input
      type="date"
      value={dueDate}
      onChange={(e) => {
        setDueDate(e.target.value);
        setError("");
      }}
      min={getTodayDate()}
    />
  </div>

  {error && <p className="error">{error}</p>}

  <div className="actions">
    <button type="button" onClick={onClose}>Cancel</button>
    <button type="submit">{editingTodo ? "Update" : "Add"}</button>
  </div>

</form>

        
      </div>
    </div>
  );
};

export default AddTodoModal;
