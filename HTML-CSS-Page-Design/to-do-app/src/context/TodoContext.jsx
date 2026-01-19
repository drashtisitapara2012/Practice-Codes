import { createContext, useContext, useEffect, useState } from "react";

const TodoContext = createContext();
export const useTodos = () => useContext(TodoContext);

const API_URL = "https://dummyjson.com/todos";
const ITEMS_PER_PAGE = 5;

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);

  /*  FETCH TODOS  */
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}?limit=30`);
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data = await res.json();
        const normalizedTodos = data.todos.map((t) => ({
          id: t.id.toString(),
          title: t.todo,
          completed: t.completed,
          priority: "Medium",
          dueDate: "",
         createdAt: Date.now() - t.id * 1000,
         reminderAt:null,
        }));
        setTodos(normalizedTodos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  /* ADD TODO  */
  const addTodo = async (todo) => {
    if (!todo?.title?.trim()) return;

    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: todo.title,
          completed: false,
          userId: 1,
        }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const data = await res.json();
      setTodos((prev) => [
        {
          id: data.id?.toString() || crypto.randomUUID(),
          title: data.todo,
          completed: data.completed,
          priority: todo.priority || "Medium",
          dueDate: todo.dueDate || "",
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /*  EDIT TODO (PUT)  */
  const editTodo = async (id, title) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: title }),
      });
      if (!res.ok) throw new Error("Failed to edit todo");
      const data = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: data.todo } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /*  TOGGLE TODO (PATCH)  */
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle todo");
      const data = await res.json();
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: data.completed } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /*  DELETE TODO  */
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /*  FILTER + SORT  */
  const filteredTodos = todos.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTodos = [...filteredTodos].sort((a, b) => {
  if (sortBy === "creationTime") {
    return b.createdAt - a.createdAt;
  }

  if (sortBy === "priority") {
    const order = { High: 1, Medium: 2, Low: 3 };
    return (order[a.priority] || 4) - (order[b.priority] || 4);
  }

  if (sortBy === "dueDate") {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  }

  return 0;
});

  /*  PAGINATION */
  const totalItems = sortedTodos.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTodos = sortedTodos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <TodoContext.Provider
      value={{
        todos,
        paginatedTodos,
        filteredTodos,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        addTodo,
        editTodo,
        deleteTodo,
        toggleTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
