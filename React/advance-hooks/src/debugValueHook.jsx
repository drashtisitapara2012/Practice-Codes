//useDebugValue is a developer-only React Hook used to label custom hooks so they show meaningful information in React DevTools.
//useDebugValue(value, format?)
import { useDebugValue } from "react";

function useAuth() {
  const user = { id: 1, role: "admin" };

  useDebugValue(
    user,
    user => user ? `Logged in (${user.role})` : "Logged out"
  );

  return user;
}
