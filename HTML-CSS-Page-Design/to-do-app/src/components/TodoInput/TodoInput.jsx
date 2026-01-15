// src/components/TodoInput/TodoInput.jsx
import React, { useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import "./TodoInput.css";

const TodoInput = ({ onAddClick }) => {
  const { searchTerm, setSearchTerm } = useTodos();

  return (
    <div className="todo-input-container">
  <h1>TODO App</h1>

  <div className="input-button-wrapper">
    <input
      type="text"
      placeholder="Search TODO..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="todo-input"
    />

    <button className="add-btn" onClick={onAddClick}>
      + Add TODO
    </button>
  </div>
</div>

  );
};

export default TodoInput;
