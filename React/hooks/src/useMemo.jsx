//useMemo memoizes a computed VALUE so react does not recalculate it on every render unless its dependencies change
import { useState, useMemo } from "react";

// Expensive function
function slowCalculation(num) {
  console.log("Running slow calculation...");
  let total = 0;

  for (let i = 0; i < 100000000; i++) {
    total += num;
  }

  return total;
}

function App() {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(5);

  // useMemo prevents recalculation unless `number` changes
  const result = useMemo(() => {
    return slowCalculation(number);
  }, [number]);


  return (
    <div style={{ padding: "20px" }}>
      <h1>useMemo Demo</h1>

      <p>
        <strong>Expensive Calculation Result:</strong> {result}
      </p>

      <button onClick={() => setNumber(number + 1)}>
        Change Number (Recalculates)
      </button>

      <br /><br />

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count (No Recalculation)
      </button>
    </div>
  );
}

export default App;
