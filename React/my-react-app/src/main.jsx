// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import JSXDemo from './JSXDemo.jsx'
// //import Car from './class.jsx'
// import {Garage,Parent} from './props.jsx'
// import App from './childParent.jsx'
// import PropTypeDemo from './propType.jsx'


// createRoot(document.getElementById('root')).render(
//   <>
//     {/* <JSXDemo />
//     <Car /> */}
//     {/* <App/>
//     <Garage/>
//     <Parent/> */}
//     <PropTypeDemo />
//   </>
// )

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
