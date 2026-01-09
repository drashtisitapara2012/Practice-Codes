//useTransition allows marking non-urgent state updates so React can keep the UI responsive during expensive renders.
import { useState, useTransition } from "react";

function SlowList({ query }) {
  const items = Array.from({ length: 15000 }, (_, i) => `Item ${i}`);
  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TransitionHook() {
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;

    // 🚀 Urgent update
    setQuery(value);

    // 🐢 Non-urgent update
    startTransition(() => {
      setDeferredQuery(value);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Type..."
      />

      {isPending && <p>Updating list...</p>}

      <SlowList query={deferredQuery} />
    </>
  );
}
