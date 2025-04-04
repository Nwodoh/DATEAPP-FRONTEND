import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

// PageNav.jsx - Navigation bar component with animated highlight effect

// This component renders the main navigation bar of the application.
// It includes links to the homepage, about page, sign-up, and login pages.
// The navigation bar features a dynamic highlight effect that moves based on
// the active route, enhancing user experience. This highlight effect is the white element that moves between the button when clicked

// Key Features:
// - Uses `useLocation` to determine the current route and highlight the active link.
// - Implements a motion-based highlight effect using `framer-motion`.
// - Excludes the navigation bar on routes that start with "/app".

function PageNav() {
  const NAV_CONTAINER_PADDING = 20;
  const location = useLocation();
  const currentPath = location.pathname;
  const navs = useMemo(
    () => [
      { to: "/", name: "home" },
      { to: "/about", name: "about" },
      { to: "/signup", name: "sign up" },
      { to: "/login", name: "login" },
    ],
    []
  );
  const [currentPage, setCurrentPage] = useState(
    navs.findIndex((nav) => nav.to.startsWith(currentPath))
  );
  const [highLightX, setHighLightX] = useState(0);
  const [highLightWidth, setHighLightWidth] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    const activeNavItem = document.querySelector(
      `a[href="${currentPath}"].home_nav_item`
    );

    if (navRef.current && activeNavItem) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeNavItem.getBoundingClientRect();
      setHighLightX(
        itemRect.left > navRect.left
          ? itemRect.left - navRect.left - NAV_CONTAINER_PADDING
          : 0
      );
      setHighLightWidth(itemRect.width + 1 / navs.length);
      setCurrentPage(navs.findIndex((nav) => nav.to.startsWith(currentPath)));
    }
  }, [currentPath, navs]);

  if (currentPath.toLocaleLowerCase().startsWith("/app")) return null;

  return (
    <nav className="absolute w-full p-4 flex justify-between text-white z-10">
      <Logo />
      <div className="basis-[45%] backdrop-blur-md rounded-full overflow-hidden bg-white/10 border-[0.1px] border-white/20">
        <ul
          ref={navRef}
          className="relative w-full flex justify-between text-sm bg-[url('/bg/paper.png')] text-white/50 px-5"
        >
          {navs.map(({ to, name }, i) => {
            const isActiveNav = i === currentPage;
            return (
              <NavigationLink
                to={to}
                key={name}
                className={`transition-all home_nav_item ${
                  isActiveNav ? "text-white" : ""
                }`}
              >
                {name}
              </NavigationLink>
            );
          })}
          <div className="absolute w-[calc(100%-39px)] h-0.5 bg-white/37 bottom-1.5 left-[50%] translate-x-[-50%] rounded-full">
            <motion.div
              className="absolute left-0 bottom-0 h-full w-[60px] bg-white rounded-full"
              style={{ width: "50px" }} // Adjust width
              animate={{ x: highLightX, width: highLightWidth }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            ></motion.div>
          </div>
        </ul>
      </div>
    </nav>
  );
}

function NavigationLink({ to, className = "", children }) {
  return (
    <li>
      <NavLink to={to} className={`inline-block py-4 px-1 ${className}`}>
        {children}
      </NavLink>
    </li>
  );
}

export default PageNav;
