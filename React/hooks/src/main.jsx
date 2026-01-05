import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UseStateDemo from './useState.jsx'
import UseEffectDemo from './useEffect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UseStateDemo />
    <UseEffectDemo/>
  </StrictMode>,
)
