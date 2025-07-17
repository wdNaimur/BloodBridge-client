import React from "react";
import { Link, NavLink } from "react-router";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import useAuth from "../../../hooks/useAuth";
import BloodBridgeLogoFull from "../../shared/BloodBridgeLogoFull";

const Footer = () => {
  const { user } = useAuth();

  const links = user?.email
    ? [
        { name: "Home", path: "/" },
        { name: "Blood Requests", path: "/blood-requests" },
        { name: "Search Donors", path: "/search" },
        { name: "Support Us", path: "/funding" },
        { name: "Blogs", path: "/blogs" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Blood Requests", path: "/blood-requests" },
        { name: "Search Donors", path: "/search" },
        { name: "Blogs", path: "/blogs" },
      ];

  return (
    <footer className="relative footer footer-center footer-horizontal text-secondary bg-base-100 pt-16 -space-y-4 overflow-hidden">
      {/* primary radial glow background */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-primary opacity-20 blur-3xl rounded-full pointer-events-none z-0"></div>

      {/* Company Info */}
      <aside className="z-10">
        <BloodBridgeLogoFull />

        <p className="opacity-70 px-4 text-center">
          Connecting hearts, saving lives — together with BloodBridge.
        </p>
      </aside>

      {/* Navigation Links */}
      <nav className="z-10">
        <ul className="flex flex-row flex-wrap items-center justify-center px-6 gap-x-4 gap-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className="hover:text-primary transition-all duration-200 font-medium text-base px-1"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Icons */}
      <nav className="z-10">
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://www.facebook.com/mdnaimurwd"
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-primary transition-all hover:scale-125 hover:-translate-y-1"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://github.com/wdNaimur"
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-primary transition-all hover:scale-125 hover:-translate-y-1"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://x.com/WdNaimur"
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-primary transition-all hover:scale-125 hover:-translate-y-1"
          >
            <FaSquareXTwitter size={24} />
          </a>
        </div>
      </nav>

      {/* Footer Bottom Text */}
      <p className="w-full py-1 z-10">
        <span className="opacity-60">
          © {new Date().getFullYear()} BloodBridge — Designed & Developed by Md.
          Naimur Rahman
        </span>
      </p>
    </footer>
  );
};

export default Footer;
