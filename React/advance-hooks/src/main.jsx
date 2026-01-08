import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginForm from './actionStateHook.jsx'
import WithDeferred from './deferredvalueHook.jsx'
import Counter from './effectEventHook.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LoginForm />
    <WithDeferred/> */}
    <Counter/>
  </StrictMode>,
)
