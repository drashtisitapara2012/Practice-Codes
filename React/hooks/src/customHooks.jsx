import { createRoot } from 'react-dom/client';
import useFetch from "./useFetch";

function CustomHooksDemo() {

  const [data] = useFetch("https://jsonplaceholder.typicode.com/todos");

  return (
    <>
    <h1>Custom Hooks Demo: </h1>
      {data &&
        data.map((item) => {
          return <p key={item.id}>{item.title}</p>;
        })}
    </>
  );
}
export default CustomHooksDemo;