//useId generates stable, unique IDs that are safe for server rendering and accessibility, preventing hydration mismatches.
import { useId } from "react";

function TextInput({ label }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <TextInput label="Email" />
      <TextInput label="Password" />
    </>
  );
}
