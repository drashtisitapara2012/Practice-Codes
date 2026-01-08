//useEffectEvent lets effects use the latest props and state without re-running or re-subscribing, avoiding stale closures and unnecessary effect executions.
import { useEffect, useEffectEvent, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    console.log(count); // always latest
  });

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  }, []); //  no dependencies

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
