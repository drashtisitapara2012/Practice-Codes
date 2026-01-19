import { useState } from "react";

function Child({ sendDataToParent }) {
  return (
    <button onClick={() => sendDataToParent("Hello from Child!")}>
      Send Data to Parent
    </button>
  );
}

function App() {
  const [message, setMessage] = useState("");

  const receiveData = (data) => {
    setMessage(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Child to Parent Data Passing</h2>

      <Child sendDataToParent={receiveData} />

      <p>
        <strong>Message from child:</strong> {message}
      </p>
    </div>
  );
}

export default App;
