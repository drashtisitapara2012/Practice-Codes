import { useState } from "react";
import "./App.css";

function App() {
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [result, setResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "number1") setNumber1(value);
    if (name === "number2") setNumber2(value);
  };

  const handleOperation = (operation) => {
    const n1 = parseInt(number1, 10);
    const n2 = parseInt(number2, 10);

    let res;
    if (operation === "add") {
      res = n1 + n2;
    } else if (operation === "subtract") {
      res = n1 - n2;
    }

    if (isNaN(res)) {
      setErrorMsg("Please enter valid numbers.");
      setResult("");
    } else {
      setErrorMsg("");
      setResult(res);
    }
  };

  return (
    <div>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <div className="input-section">
        <label>First Number</label>
        <input
          type="text"
          name="number1"
          value={number1}
          onChange={onInputChange}
          placeholder="Enter a number"
        />
      </div>

      <div className="input-section">
        <label>Second Number</label>
        <input
          type="text"
          name="number2"
          value={number2}
          onChange={onInputChange}
          placeholder="Enter a number"
        />
      </div>

      <div className="result-section">
        Result: <span className="result">{result}</span>
      </div>

      <button className="btn" onClick={() => handleOperation("add")}>
        Add
      </button>
      <button className="btn" onClick={() => handleOperation("subtract")}>
        Subtract
      </button>
    </div>
  );
}

export default App;
