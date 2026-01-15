import { useEffect, useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import "./AddTodoModal.css";

const AddTodoModal = ({ onClose }) => {
  const { addTodo, todos } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current.focus();
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    const exists = todos.some(
      (t) => t.title.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (exists) {
      setError("This TODO already exists");
      return;
    }

    addTodo({
      title: trimmedTitle,
      description,
      priority,
      dueDate,
      completed: false,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New TODO</h2>
<form onSubmit={handleSubmit}>

  <div className="form-group">
    <label>Title *</label>
    <input
      ref={titleRef}
      type="text"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        setError("");
      }}
    />
  </div>

  <div className="form-group">
    <label>Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
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
    <label>Due Date</label>
    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
    />
  </div>

  {error && <p className="error">{error}</p>}

  <div className="actions">
    <button type="button" onClick={onClose}>Cancel</button>
    <button type="submit">Add</button>
  </div>

</form>

        
      </div>
    </div>
  );
};

export default AddTodoModal;
