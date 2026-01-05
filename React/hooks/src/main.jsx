import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UseStateDemo from './useState.jsx'
import UseEffectDemo from './useEffect.jsx'
import UseContextDemo from './useContext.jsx'
import Timer from './useRef.jsx'
import Counter from './useReducer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UseStateDemo />
    <UseEffectDemo/>
    <UseContextDemo/>
    <Timer/>
    <Counter/>
  </StrictMode>
)
