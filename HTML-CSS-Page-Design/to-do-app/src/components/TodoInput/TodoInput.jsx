// src/components/TodoInput/TodoInput.jsx
import React, { useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import FilterBar from "../FilterBar/FilterBar";
import "./TodoInput.css";
import {useDebounce} from '../../hooks/useDebounce';

const TodoInput = ({ onAddClick }) => {
  const { searchTerm, setSearchTerm } = useTodos();
  const debouncedSearchTerm = useDebounce(searchTerm, 5000); 
  React.useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

  <FilterBar />
</div>

  );
};

export default TodoInput;
