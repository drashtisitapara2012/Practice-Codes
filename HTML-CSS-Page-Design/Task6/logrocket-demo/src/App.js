import React from "react";
import LogRocket from "logrocket";

function App() {

  const logEvent = () => {
    LogRocket.log("User clicked log button");
    alert("LogRocket event logged");
  };

  const triggerError = () => {
    try {
      const data = null;
      data.test(); // runtime error
    } catch (err) {
      console.error("Console error:", err);
      LogRocket.captureException(err);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>LogRocket Demo</h1>

      <button onClick={logEvent}>
        Log Custom Event
      </button>

      <br /><br />

      <button onClick={triggerError}>
        Trigger Error
      </button>
    </div>
  );
}

export default App;
