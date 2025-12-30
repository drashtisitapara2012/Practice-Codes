import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LogRocket from "logrocket";

LogRocket.init("5nvuqi/demo");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
