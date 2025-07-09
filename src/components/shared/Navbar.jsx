import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import BloodBridgeLogo from "./BloodBridgeLogo";
import useAuth from "../../hooks/useAuth";
import NavProfile from "./NavProfile";

const Navbar = () => {
  const { user } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (diff > 200) {
        setShowNavbar(false);
      } else if (diff < -20) {
        setShowNavbar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Funding", path: "/funding" },
  ];

  const navLink = (
    <>
      {navItems.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className="px-2 rounded-none font-bold opacity-70 hover:bg-transparent hover:opacity-100 transition-all duration-300 border-b-[3px] border-dashed border-transparent py-0 text-base"
          >
            {item.name}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "linear" }}
          className="navbar bg-base-200/90 rounded-2xl p-2 px-4 backdrop-blur-2xl sticky top-5 z-50 border border-base-200/80 shadow-xl shadow-primary/5 select-none"
        >
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className=" pr-2 lg:hidden cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content bg-base-100 shadow-xl shadow-primary/10 rounded-box z-1 mt-3 w-52 p-2 flex flex-col gap-3 justify-center items-center"
              >
                {navLink}
              </ul>
            </div>
            <BloodBridgeLogo />
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="space-x-3 flex text-base">{navLink}</ul>
          </div>
          <div className="navbar-end">
            {user ? (
              <NavProfile />
            ) : (
              <button>
                <Link
                  to="signin"
                  className="btn btn-primary text-white border-none shadow-none  "
                >
                  Sign In
                </Link>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
