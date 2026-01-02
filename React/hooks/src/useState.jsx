import { useState } from "react";
function StateDemo(){
    const [count,setCount] =useState(0);
    return(
        <div style={{padding : "20px"}}>
            <h2>Counter Example</h2>
            <p>Count :{count}</p>

            <button onClick={()=>setCount(count+1)}>Increment</button>
            <button onClick={()=>setCount(count-1)}>Decrement</button>

        </div>
    );
}
export default StateDemo;