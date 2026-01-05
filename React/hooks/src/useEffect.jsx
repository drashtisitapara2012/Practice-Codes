// useEffect is a React Hook that lets you perform side effects in functional components. anything thatis outside rendering : API calls,subscriptions,timers,logging
import { useState, useEffect } from "react";

function UseEffectDemo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // runs once (on mount)

  return (
    <div style={{ padding: "20px" }}>
        <h1>useEffect Demo : </h1>
      <h2>User List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UseEffectDemo;
