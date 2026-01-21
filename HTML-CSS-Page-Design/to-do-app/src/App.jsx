import { useState } from "react";
import TodoInput from "./components/TodoInput/TodoInput";
import TodoList from "./components/TodoList/TodoList";
import AddTodoModal from "./components/AddTodoModal/AddTodoModal";

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTodo(null);
  };

  return (
    <>
      <TodoInput onAddClick={() => setIsAddModalOpen(true)} />

      <TodoList onEdit={handleEditTodo} />

      {(isAddModalOpen || editingTodo) && (
        <AddTodoModal 
          onClose={handleCloseModal}
          editingTodo={editingTodo}
        />
      )}
    </>
  );
}

export default App;


