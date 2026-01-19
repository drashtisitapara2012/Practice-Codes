import { useTodos } from "../../context/TodoContext";
import "./FilterBar.css";

const FilterBar = () => {
  const { sortBy, setSortBy } = useTodos();

  return (
      
    <div className="flex justify-center gap-8 my-6 mx-auto w-full max-w-[600px] px-4 animate-slideDown sm:flex-row flex-col sm:gap-8 gap-3">
      <div className="flex items-center gap-8 text-sm font-semibold text-[#6b7d8f]">
        <label className="flex items-center gap-5" htmlFor="sort-select">Sort by </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 pr-12  py-2 text-sm font-semibold text-[#5a6b7d] bg-white 
             border-2 border-[#667eea] rounded-lg cursor-pointer min-w-[180px]
             shadow-[0_2px_8px_rgba(102,126,234,0.15)]
             transition-all duration-300 ease-in-out
             hover:border-[#764ba2] hover:shadow-[0_4px_12px_rgba(102,126,234,0.25)]
             focus:outline-none focus:border-[#764ba2] focus:ring-1 focus:ring-[#667eea] focus:bg-[#f9fbfc]">
          <option value="creationTime">Creation Time</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
