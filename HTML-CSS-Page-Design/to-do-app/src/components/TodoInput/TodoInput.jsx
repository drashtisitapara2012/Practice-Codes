// src/components/TodoInput/TodoInput.jsx
import React,{useRef} from "react";
import { useTodos } from "../../context/TodoContext";
import FilterBar from "../FilterBar/FilterBar";
import "./TodoInput.css";

const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
const TodoInput = ({ onAddClick, isAddFormOpen }) => {
 const { searchTerm, setSearchTerm } = useTodos();
  const debouncedSearch = useRef(debounce(setSearchTerm, 500)).current;

  return (
    <div
      className={`
        flex flex-col items-center gap-3 my-7 mx-auto w-[90%] max-w-[500px]
        ${!isAddFormOpen ? " top-0 z-40 bg-white pt-4" : ""}
      `}
    >
      <h1 className="text-[28px] font-bold text-[#5c79f8] m-0 text-center sm:text-left">
        Taskify
      </h1>

      <div className="flex w-full gap-2 sm:flex-row flex-col">
        <input
          type="text"
          placeholder="Search TODO..."
          value={searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="flex-1 h-[39px] px-3 text-sm border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-colors duration-200"
        />

        <button
          className="h-[39px] px-6 text-sm font-bold text-white rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(102,126,234,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[3px]"
          onClick={onAddClick}
        >
          + Add TODO
        </button>
      </div>

      <FilterBar />
    </div>
  );
};

export default TodoInput;
