//useCallback memoizes a function so that React does not recreate the function on every render unless its dependencies change.
import { useState, useCallback } from "react";
import Child from "./Child";

function UseCallbackDemo() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Child button clicked");
  }, []); // function is memoized



  return (
    <div style={{ padding: "20px" }}>
      <h1>useCallback Demo</h1>

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Parent Count
      </button>

      <Child onClick={handleClick} />
    </div>
  );
}

export default UseCallbackDemo;
