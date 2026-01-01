import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JSXDemo from './JSXDemo.jsx'
//import Car from './class.jsx'
import {Garage,Parent} from './props.jsx'



createRoot(document.getElementById('root')).render(
  <>
    {/* <JSXDemo />
    <Car /> */}
    <Garage/>
    <Parent/>
  </>
)
