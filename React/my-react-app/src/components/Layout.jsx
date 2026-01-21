import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
    </>
  );
}

export default Layout;
