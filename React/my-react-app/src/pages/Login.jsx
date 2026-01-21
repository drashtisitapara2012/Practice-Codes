import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <>
      <h2>Login Page</h2>
      <button onClick={() => navigate("/dashboard")}>
        Login
      </button>
    </>
  );
}

export default Login;
