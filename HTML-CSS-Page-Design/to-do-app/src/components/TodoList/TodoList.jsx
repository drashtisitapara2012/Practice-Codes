import { useTodos } from "../../context/TodoContext";
import TodoItem from "../TodoItem/TodoItem";
import Pagination from "../Pagination/Pagination";

const TodoList = ({ onEdit }) => {
  const { paginatedTodos, filteredTodos } = useTodos();

  console.log("Rendered TodoList", { paginatedTodos, filteredTodos });

  const total = filteredTodos.length;
  const completed = filteredTodos.filter((todo) => todo.completed).length;
  const remaining = total - completed;

  if (total === 0) {
    return (
      <p className="text-center text-[18px] text-[#6b7d8f] bg-[rgba(176,190,197,0.08)] py-12 px-8 rounded-2xl mx-auto my-8 max-w-[800px] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)] animate-slideUp">
        No TODOs found
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 mx-auto mb-12 max-w-[800px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md border border-[rgba(176,190,197,0.2)] animate-slideUp">
      
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 pb-8 border-b-2 border-gray-100">
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
          <span className="block text-[13px] font-semibold uppercase tracking-wide mb-2">
            Total
          </span>
          <span className="text-3xl font-bold">{total}</span>
        </div>

        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-400 text-green-950 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
          <span className="block text-[13px] font-semibold uppercase tracking-wide mb-2 text-green-900">
            Completed
          </span>
          <span className="text-3xl font-bold">{completed}</span>
        </div>

        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-400 to-red-500 text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
          <span className="block text-[13px] font-semibold uppercase tracking-wide mb-2">
            Remaining
          </span>
          <span className="text-3xl font-bold">{remaining}</span>
        </div>
      </div>


      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "400px" }}
      >
        <ul className="list-none p-0 m-0">
          {paginatedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
          ))}
        </ul>
      </div>

      {/* Pagination (stays visible) */}
      <Pagination />
    </div>
  );
};

export default TodoList;
