import React from "react";
import * as Sentry from "@sentry/react";
import LogRocket from "logrocket";

function App() {
  
  const sentryOnlyHandler = () => {
    try {
      throw new Error("Sentry-only error triggered");
    } catch (err) {
       console.error("Console error (Sentry):", err);
      Sentry.captureException(err);
    }
  };

 
  const logRocketOnlyHandler = () => {
    LogRocket.log("LogRocket button clicked");

    try {
      // Safe runtime error without ESLint issue
      const obj = null;
      obj.test(); // TypeError
    } catch (err) {
       console.error("Console error (logrocket):", err);
      LogRocket.captureException(err);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Frontend Logging Demo</h1>

      <button
        onClick={sentryOnlyHandler}
        style={{
          padding: "10px 20px",
          marginRight: "20px",
          backgroundColor: "crimson",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
         Trigger Sentry Error
      </button>

      <button
        onClick={logRocketOnlyHandler}
        style={{
          padding: "10px 20px",
          backgroundColor: "royalblue",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
         Trigger LogRocket Error
      </button>
    </div>
  );
}

export default App;
