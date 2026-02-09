import React from "react";

const Child = React.memo(({ onClick }) => {
  console.log("Child rendered");

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
});

export default Child;
