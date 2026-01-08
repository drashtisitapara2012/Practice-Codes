//useActionState is a new React hook (React 19) designed mainly for handling async actions, especially form submissions and server actions in a clean, predictable way.
//helps manage : the result of an action, the pending (loading) state ,the latest submitted data
//const [state, action, isPending] = useActionState(actionFunction,initialState);
import { useActionState } from "react";

async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "All fields required" };
  }

  await new Promise(r => setTimeout(r, 1500));

  if (password !== "admin") {
    return { error: "Invalid credentials" };
  }

  return { success: true };
}

export default function LoginForm() {
  const [state, loginAction, isPending] = useActionState(login, {});

  return (
    <form action={loginAction}>
      <input name="email" placeholder="Email" /><br></br>
      <input name="password" type="password" /><br></br>

      <button disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>

      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state?.success && <p>Login successful!</p>}
    </form>
  );
}
