import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = false; // change to true to allow access

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
