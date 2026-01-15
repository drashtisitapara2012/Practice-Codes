// src/context/TodoContext.jsx
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useLocalStorage("todos", []);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedTodoId, setHighlightedTodoId] = useState(null);


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

    return (
        <TodoContext.Provider
            value={{
                todos,
                filteredTodos,
                searchTerm,
                setSearchTerm,
                addTodo,
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
