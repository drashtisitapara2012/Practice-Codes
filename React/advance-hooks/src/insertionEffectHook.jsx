//useInsertionEffect is used to synchronously inject styles into the DOM before React applies DOM updates, preventing visual flicker and ensuring correct styling, especially in CSS-in-JS libraries.
import { useInsertionEffect } from "react";

export default function Box() {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.box { background: red; }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <div className="box">Hello</div>;
}
