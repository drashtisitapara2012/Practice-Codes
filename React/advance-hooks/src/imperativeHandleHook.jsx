//It lets child component expose specific methods to its parent -- instead of exposing the entire DOM
//useImperativeHandle(ref,createHandle,deps?)
import { useRef } from "react";
import CustomInput from "./UserForm";

export default function App() {
  const inputRef = useRef(null);

  return (
    <div>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current.focus()}>
        Focus Input (will be accessed)
      </button>

      <button onClick={() => inputRef.current.clearInput()}>
        Clear Input (not be allowed to access)
      </button>
    </div>
  );
}
