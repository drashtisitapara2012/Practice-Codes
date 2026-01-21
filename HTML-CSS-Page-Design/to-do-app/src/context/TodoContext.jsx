import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  const [filter, setFilter] = useState("all"); // all | completed | remaining
  const [currentPage, setCurrentPage] = useState(1);

  /* FETCH TODOS */
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
          description: "",
          createdAt: Date.now() - t.id * 1000,
          reminderAt: null,  // timestamp when reminder should fire
          notified: false,   // to prevent repeated alerts
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

  /* RESET PAGE WHEN FILTER / SEARCH CHANGES */
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  /* ADD TODO */
  const addTodo = async (todo) => {
    if (!todo?.title?.trim()) return;

    // Calculate reminder timestamp
    let reminderAt = null;
    if (todo.dueDate && todo.reminder) {
      const dueTime = new Date(todo.dueDate).getTime();
      if (todo.reminder.type === "minutes") {
        reminderAt = dueTime - todo.reminder.value * 60 * 1000;
      } else if (todo.reminder.type === "hours") {
        reminderAt = dueTime - todo.reminder.value * 60 * 60 * 1000;
      } else if (todo.reminder.type === "days") {
        reminderAt = dueTime - todo.reminder.value * 24 * 60 * 60 * 1000;
      }
    }

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

      const data = await res.json();

      setTodos((prev) => [
        {
          id: data.id?.toString() || crypto.randomUUID(),
          title: data.todo,
          completed: false,
          priority: todo.priority || "Medium",
          dueDate: todo.dueDate || "",
          description: todo.description || "",
          createdAt: Date.now(),
          reminderAt,
          notified: false,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /* EDIT TODO */
  const editTodo = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: updates.title }),
      });

      const data = await res.json();

      // Calculate updated reminder timestamp
      let reminderAt = null;
      if (updates.dueDate && updates.reminder) {
        const dueTime = new Date(updates.dueDate).getTime();
        if (updates.reminder.type === "minutes") {
          reminderAt = dueTime - updates.reminder.value * 60 * 1000;
        } else if (updates.reminder.type === "hours") {
          reminderAt = dueTime - updates.reminder.value * 60 * 60 * 1000;
        } else if (updates.reminder.type === "days") {
          reminderAt = dueTime - updates.reminder.value * 24 * 60 * 60 * 1000;
        }
      }

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: data.todo,
                dueDate: updates.dueDate || t.dueDate,
                priority: updates.priority || t.priority,
                description: updates.description || t.description,
                reminderAt,
                notified: false,
              }
            : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* TOGGLE TODO */
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

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

  /* DELETE TODO */
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* FILTER + SEARCH + SORT */
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // status filter
    if (filter === "completed") result = result.filter((t) => t.completed);
    if (filter === "remaining") result = result.filter((t) => !t.completed);

    // search
    if (searchTerm) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // sort
    if (sortBy === "creationTime") result.sort((a, b) => b.createdAt - a.createdAt);
    if (sortBy === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4));
    }
    if (sortBy === "dueDate") {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return result;
  }, [todos, filter, searchTerm, sortBy]);

  /* PAGINATION */
  const totalItems = filteredTodos.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTodos = filteredTodos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* REMINDER CHECK INTERVAL */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      todos.forEach((todo) => {
        if (todo.reminderAt && !todo.notified && now >= todo.reminderAt) {
          alert(`Reminder: "${todo.title}" is due soon!`);
          setTodos((prev) =>
            prev.map((t) =>
              t.id === todo.id ? { ...t, notified: true } : t
            )
          );
        }
      });
    }, 60 * 1000); // check every 1 minute

    return () => clearInterval(interval);
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        paginatedTodos,

        loading,
        error,

        searchTerm,
        setSearchTerm,

        sortBy,
        setSortBy,

        filter,
        setFilter,

        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,

        addTodo,
        editTodo,
        toggleTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};


// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { client } from "../sanity/client";

// const TodoContext = createContext();
// export const useTodos = () => useContext(TodoContext);

// const ITEMS_PER_PAGE = 5;

// export const TodoProvider = ({ children }) => {
//   const [todos, setTodos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("none");
//   const [filter, setFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   /* ================= FETCH TODOS FROM SANITY ================= */
//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         setLoading(true);

//         const data = await client.fetch(
//           `*[_type == "todo"] | order(_createdAt desc)`
//         );

//         const normalized = data.map((t) => ({
//           id: t._id,
//           title: t.title,
//           completed: t.completed ?? false,
//           priority: t.priority ?? "Medium",
//           dueDate: t.dueDate ?? "",
//           description: t.description ?? "",
//           createdAt: new Date(t._createdAt).getTime(),
//           reminderAt: t.reminderAt ?? null,
//           notified: false,
//         }));

//         setTodos(normalized);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch todos from Sanity");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodos();
//   }, []);

//   /* RESET PAGE WHEN FILTER / SEARCH CHANGES */
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter, searchTerm]);

//   /* ================= ADD TODO ================= */
//   const addTodo = async (todo) => {
//     if (!todo?.title?.trim()) return;

//     let reminderAt = null;
//     if (todo.dueDate && todo.reminder) {
//       const dueTime = new Date(todo.dueDate).getTime();
//       if (todo.reminder.type === "minutes")
//         reminderAt = dueTime - todo.reminder.value * 60 * 1000;
//       if (todo.reminder.type === "hours")
//         reminderAt = dueTime - todo.reminder.value * 60 * 60 * 1000;
//       if (todo.reminder.type === "days")
//         reminderAt = dueTime - todo.reminder.value * 24 * 60 * 60 * 1000;
//     }

//     try {
//       const created = await client.create({
//         _type: "todo",
//         title: todo.title,
//         completed: false,
//         priority: todo.priority || "Medium",
//         dueDate: todo.dueDate || "",
//         description: todo.description || "",
//         reminderAt,
//       });

//       setTodos((prev) => [
//         {
//           id: created._id,
//           title: created.title,
//           completed: created.completed,
//           priority: created.priority,
//           dueDate: created.dueDate,
//           description: created.description,
//           createdAt: Date.now(),
//           reminderAt,
//           notified: false,
//         },
//         ...prev,
//       ]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= EDIT TODO ================= */
//   const editTodo = async (id, updates) => {
//     try {
//       await client
//         .patch(id)
//         .set({
//           title: updates.title,
//           priority: updates.priority,
//           dueDate: updates.dueDate,
//           description: updates.description,
//         })
//         .commit();

//       setTodos((prev) =>
//         prev.map((t) =>
//           t.id === id ? { ...t, ...updates, notified: false } : t
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= TOGGLE TODO ================= */
//   const toggleTodo = async (id) => {
//     const todo = todos.find((t) => t.id === id);
//     if (!todo) return;

//     try {
//       await client
//         .patch(id)
//         .set({ completed: !todo.completed })
//         .commit();

//       setTodos((prev) =>
//         prev.map((t) =>
//           t.id === id ? { ...t, completed: !t.completed } : t
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= DELETE TODO ================= */
//   const deleteTodo = async (id) => {
//     try {
//       await client.delete(id);
//       setTodos((prev) => prev.filter((t) => t.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= FILTER + SEARCH + SORT ================= */
//   const filteredTodos = useMemo(() => {
//     let result = [...todos];

//     if (filter === "completed") result = result.filter((t) => t.completed);
//     if (filter === "remaining") result = result.filter((t) => !t.completed);

//     if (searchTerm) {
//       result = result.filter((t) =>
//         t.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortBy === "creationTime")
//       result.sort((a, b) => b.createdAt - a.createdAt);

//     if (sortBy === "priority") {
//       const order = { High: 1, Medium: 2, Low: 3 };
//       result.sort(
//         (a, b) => (order[a.priority] || 4) - (order[b.priority] || 4)
//       );
//     }

//     if (sortBy === "dueDate") {
//       result.sort((a, b) => {
//         if (!a.dueDate) return 1;
//         if (!b.dueDate) return -1;
//         return new Date(a.dueDate) - new Date(b.dueDate);
//       });
//     }

//     return result;
//   }, [todos, filter, searchTerm, sortBy]);

//   /* ================= PAGINATION ================= */
//   const totalItems = filteredTodos.length;
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedTodos = filteredTodos.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE
//   );

//   /* ================= REMINDER CHECK ================= */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       todos.forEach((todo) => {
//         if (todo.reminderAt && !todo.notified && now >= todo.reminderAt) {
//           alert(`Reminder: "${todo.title}" is due soon!`);
//           setTodos((prev) =>
//             prev.map((t) =>
//               t.id === todo.id ? { ...t, notified: true } : t
//             )
//           );
//         }
//       });
//     }, 60 * 1000);

//     return () => clearInterval(interval);
//   }, [todos]);

//   return (
//     <TodoContext.Provider
//       value={{
//         todos,
//         filteredTodos,
//         paginatedTodos,

//         loading,
//         error,

//         searchTerm,
//         setSearchTerm,

//         sortBy,
//         setSortBy,

//         filter,
//         setFilter,

//         currentPage,
//         setCurrentPage,
//         totalPages,
//         totalItems,

//         addTodo,
//         editTodo,
//         toggleTodo,
//         deleteTodo,
//       }}
//     >
//       {children}
//     </TodoContext.Provider>
//   );
// };
