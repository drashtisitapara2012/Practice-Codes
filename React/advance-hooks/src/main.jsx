import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginForm from './actionStateHook.jsx'
import WithDeferred from './deferredvalueHook.jsx'
import Counter from './effectEventHook.jsx'
import InputField from './idHook.jsx'
import ImperativeHook from './imperativeHandleHook.jsx'
import Box from './insertionEffectHook.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LoginForm />
    <WithDeferred/>
    <Counter/>
    <InputField/>
    <ImperativeHook/> */}
    <Box/>
  </StrictMode>,
)
