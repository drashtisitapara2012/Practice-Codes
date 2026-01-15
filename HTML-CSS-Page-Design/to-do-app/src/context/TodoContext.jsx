// src/context/TodoContext.jsx
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useLocalStorage("todos", []);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedTodoId, setHighlightedTodoId] = useState(null);
    const [sortBy, setSortBy] = useState("none");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; 


    // Add new TODO
    const addTodo = (todo) => {
    if (!todo?.title?.trim()) return;

    setTodos((prev) => [
      ...prev,
      {
        ...todo,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
        completed: false,
      },
    ]);
  };

    // Delete TODO
    const deleteTodo = (id) => {
         setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    // Edit TODO
    const editTodo = (id, updatedTodo) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, ...updatedTodo } : todo
            )
        );
    };

    // Toggle completed
    const toggleTodo = (id) => {
        setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    };

    // Filter TODOs based on search
    const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort TODOs based on selected sort option
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === "priority") {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        }
        if (sortBy === "dueDate") {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            return dateA - dateB;
        }
        return 0;
    });

    // Calculate pagination
    const totalItems = sortedTodos.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTodos = sortedTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <TodoContext.Provider
            value={{
                todos,
                filteredTodos,
                sortedTodos,
                paginatedTodos,
                searchTerm,
                setSearchTerm,
                sortBy,
                setSortBy,
                currentPage,
                setCurrentPage,
                totalPages,
                totalItems: sortedTodos.length,
                addTodo,
                editTodo,
                deleteTodo,
                toggleTodo,
                highlightedTodoId,
                setHighlightedTodoId,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};
