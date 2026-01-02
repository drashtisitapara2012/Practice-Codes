import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StateDemo from './useState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StateDemo />
  </StrictMode>,
)
