import { useState } from "react";
import TodoInput from "./components/TodoInput/TodoInput";
import TodoList from "./components/TodoList/TodoList";
import AddTodoModal from "./components/AddTodoModal/AddTodoModal";

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <TodoInput onAddClick={() => setIsAddModalOpen(true)} />

      <TodoList />

      {isAddModalOpen && (
        <AddTodoModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </>
  );
}

export default App;
