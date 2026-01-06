import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UseStateDemo from './useState.jsx'
import UseEffectDemo from './useEffect.jsx'
import UseContextDemo from './useContext.jsx'
import Timer from './useRef.jsx'
import Counter from './useReducer.jsx'
import UseCallbackDemo from './useCallback.jsx'
import UseMemoDemo from './useMemo.jsx'
import CustomHooksDemo from './customHooks.jsx'
import FormDemo from './form.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <UseStateDemo />
    <UseEffectDemo/>
    <UseContextDemo/>
    <Timer/>
    <Counter/>
    <UseCallbackDemo/>
    <UseMemoDemo/>
    <CustomHooksDemo/> */}
    <FormDemo/>
  </StrictMode>
)
