// src/components/TodoInput/TodoInput.jsx
import React, { useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import FilterBar from "../FilterBar/FilterBar";
import "./TodoInput.css";
import { useDebounce } from '../../hooks/useDebounce';

const TodoInput = ({ onAddClick }) => {
  const { searchTerm, setSearchTerm } = useTodos();
  const debouncedSearchTerm = useDebounce(searchTerm, 5000);
  React.useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col items-center gap-3 my-7 mx-auto w-[90%] max-w-[500px]">
      <h1 className="text-[28px] font-bold text-[#5c79f8] m-0 text-center sm:text-left">TODO App</h1>

      <div className="flex w-full gap-2 sm:flex-row flex-col">
        <input
          type="text"
          placeholder="Search TODO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-[39px] px-3 text-sm border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-colors duration-200"

        />

        <button className="h-[39px] px-6 text-sm font-bold text-white rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(102,126,234,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:-translate-y-[1px] active:shadow-[0_2px_8px_rgba(102,126,234,0.3)]"
          onClick={onAddClick}>
          + Add TODO
        </button>
      </div>

      <FilterBar />
    </div>

  );
};

export default TodoInput;
