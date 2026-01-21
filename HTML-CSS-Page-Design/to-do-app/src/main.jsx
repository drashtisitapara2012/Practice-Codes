import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TodoProvider } from "./context/TodoContext.jsx";
import { StaticContentProvider } from "./context/StaticContentContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StaticContentProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </StaticContentProvider>
  </StrictMode>
);
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { TodoProvider } from "./context/TodoContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <TodoProvider>
//       <App />
//     </TodoProvider>
//   </React.StrictMode>
// );
