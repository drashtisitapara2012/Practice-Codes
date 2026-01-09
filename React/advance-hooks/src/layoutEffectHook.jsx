//useLayoutEffect is used when you need to read or synchronously modify the DOM immediately after updates but before the browser paints, preventing layout shifts or flickering.
import { useLayoutEffect, useRef, useState } from "react";

function Tooltip() {
  const boxRef = useRef(null);
  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    const rect = boxRef.current.getBoundingClientRect();
    setLeft(window.innerWidth / 2 - rect.width / 2);
  }, []);



  return (
    <div
      ref={boxRef}
      style={{
        position: "absolute",
        left,
        top: 50,
        background: "black",
        color: "white",
        padding: "8px",
      }}
    >
      Tooltip
    </div>
  );
}

export default Tooltip;
