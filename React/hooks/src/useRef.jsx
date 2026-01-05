import { useRef, useState } from "react";

function Timer() {
  const intervalRef = useRef(null);
  const [time, setTime] = useState(0);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>Time: {time}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
export default Timer;