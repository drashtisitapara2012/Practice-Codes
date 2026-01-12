import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginForm from './actionStateHook.jsx'
import WithDeferred from './deferredvalueHook.jsx'
import Counter from './effectEventHook.jsx'
import InputField from './idHook.jsx'
import ImperativeHook from './imperativeHandleHook.jsx'
import Box from './insertionEffectHook.jsx'
import Tooltip from './layoutEffectHook.jsx'
import LikeButton from './optimisticHook.jsx'
import TransitionHook from './transitionHook.jsx'
import SyncExternalStore from './syncExternalStoreHook.jsx'
import FormHandling from './formHandling.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LoginForm />
    <WithDeferred/>
    <Counter/>
    <InputField/>
    <ImperativeHook/>
    <Box/> 
    <Tooltip/>
    <LikeButton/>
    <TransitionHook/> 
    <SyncExternalStore/>*/}
    <FormHandling/>
  </StrictMode>,
)
