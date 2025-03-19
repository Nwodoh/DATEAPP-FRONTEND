import { Link, Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Profile from "./Profile";

function Sidebar() {
  return (
    <div className="p-5 pb-2">
      <div className="flex items-center justify-between mb-1">
        <Link
          to="/"
          className="satisfy-regular text-white tracking-wider text-xl"
        >
          datemap
        </Link>
        <Profile />
      </div>
      <div className="my-3 flex justify-center">
        <AppNav className="grow max-w-[90%]" />
      </div>

      <div className="min-w-[300px] w-[40vw] h-[60svh] p-2">
        <Outlet />
      </div>

      <footer className>
        <p className>
          &copy; Copyright {new Date().getFullYear()} by DateMap Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
