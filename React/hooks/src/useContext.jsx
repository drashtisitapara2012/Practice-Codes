import { useState } from "react";
import ThemeContext from "./ThemeContext";
import Page from "./Page";

function UseContextDemo() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

export default UseContextDemo;
