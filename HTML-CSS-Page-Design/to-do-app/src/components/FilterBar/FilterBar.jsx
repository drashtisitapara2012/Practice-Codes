import { useTodos } from "../../context/TodoContext";
import "./FilterBar.css";

const FilterBar = () => {
  const { sortBy, setSortBy } = useTodos();

  return (
    <div className="my-6 px-4 w-full animate-slideDown">
      {/* Wrapper */}
      <div className="mx-auto w-full max-w-[600px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        
        {/* Sort Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full">
          
          <label
            htmlFor="sort-select"
            className="text-sm font-semibold text-[#6b7d8f]"
          >
            Sort by
          </label>

          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              w-full sm:w-auto
              px-3 py-2 pr-10
              text-sm font-semibold text-[#5a6b7d]
              bg-white
              border-2 border-[#667eea]
              rounded-lg
              cursor-pointer
              shadow-[0_2px_8px_rgba(102,126,234,0.15)]
              transition-all duration-300 ease-in-out
              hover:border-[#764ba2]
              hover:shadow-[0_4px_12px_rgba(102,126,234,0.25)]
              focus:outline-none
              focus:border-[#764ba2]
              focus:ring-1
              focus:ring-[#667eea]
              focus:bg-[#f9fbfc]
            "
          >
            <option value="creationTime">Creation Time</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;
