import { forwardRef, useImperativeHandle, useRef } from "react";

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  //  Internal method (NOT exposed)
  function clearInput() {
    inputRef.current.value = "";
  }

  //  Only expose focus()
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    }
  }));

  return (
    <input ref={inputRef} placeholder="Type something..." />
  );
});

export default CustomInput;
