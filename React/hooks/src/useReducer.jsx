//useReducer is a React Hook used to manage complex state logic in a predictable way. can use when State has many fields. useReducer is preferred over useState when state logic is complex and involves multiple actions.
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };

    case "DECREMENT":
      return { count: state.count - 1 };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
        <h1>useReducer Demo : </h1>
      <h2>Count: {state.count}</h2>

      <button onClick={() => dispatch({ type: "INCREMENT" })}>
        +
      </button>

      <button onClick={() => dispatch({ type: "DECREMENT" })}>
        -
      </button>

      <button onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
