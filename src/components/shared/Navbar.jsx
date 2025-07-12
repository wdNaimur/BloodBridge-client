import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import BloodBridgeLogo from "./BloodBridgeLogo";
import useAuth from "../../hooks/useAuth";
import NavProfile from "./NavProfile";

const Navbar = () => {
  const { user } = useAuth();

  // Navbar visibility state based on scroll direction
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  // State to control mobile dropdown open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ref to detect outside click on dropdown
  const dropdownRef = useRef(null);

  // Hide/show navbar on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      // If scrolled down >40px, hide navbar
      if (diff > 40) {
        setShowNavbar(false);
      }
      // If scrolled up >1px, show navbar
      else if (diff < -1) {
        setShowNavbar(true);
      }

      // Update last scroll position
      lastScrollY.current = currentY;
    };

    // Attach scroll listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Close mobile dropdown if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicked element is not inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMobileOpen(false); // close dropdown
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blood Requests", path: "/blood-requests" },
    { name: "Search Donors", path: "/search" },
    { name: "Support Us", path: "/funding" },
    { name: "Blog", path: "/blog" },
  ];

  //  Shared NavLink JSX — reused for both desktop and mobile
  const navLink = (
    <>
      {navItems.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            onClick={() => setMobileOpen(false)} //  Close dropdown when link is clicked
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
          {/*  Fullscreen overlay when mobile dropdown is open */}
          {mobileOpen && (
            <div className="fixed inset-0 z-40 lg:hidden h-screen w-screen -top-6 -left-6" />
          )}

          <div className="navbar-start">
            {/*  Mobile Hamburger Menu */}
            <div className="relative lg:hidden" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="pr-2 cursor-pointer z-50 relative"
                onClick={() => setMobileOpen((prev) => !prev)} //  Toggle dropdown
              >
                {/* Hamburger icon */}
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

              {/* 📌 Mobile dropdown menu */}
              {mobileOpen && (
                <ul className="absolute left-0 mt-3 w-52 z-50 bg-base-100 shadow-xl shadow-primary/10 rounded-box p-3 flex flex-col gap-3">
                  {navLink}
                </ul>
              )}
            </div>

            {/*  Logo */}
            <BloodBridgeLogo />
          </div>

          {/*  Desktop Nav */}
          <div className="navbar-center hidden lg:flex">
            <ul className="space-x-3 flex text-base">{navLink}</ul>
          </div>

          {/*  User profile or sign-in button */}
          <div className="navbar-end">
            {user ? (
              <NavProfile />
            ) : (
              <button>
                <Link
                  to="signin"
                  className="btn rounded-xl btn-primary uppercase text-white border-none shadow-none"
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
