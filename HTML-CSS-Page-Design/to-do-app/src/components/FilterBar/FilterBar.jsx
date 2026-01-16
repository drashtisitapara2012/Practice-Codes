import { useTodos } from "../../context/TodoContext";
import "./FilterBar.css";

const FilterBar = () => {
  const { sortBy, setSortBy } = useTodos();

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="sort-select">Sort by </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
