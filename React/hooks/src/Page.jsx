import { useContext } from "react";
import ThemeContext from "./ThemeContext";

function Page() {
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
        padding: "20px"
      }}
    >
      <h1>useContext Demo : </h1>
      Current Theme: {theme}
    </div>
  );
}

export default Page;
