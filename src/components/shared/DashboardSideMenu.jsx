import React from "react";
import useAuth from "../../hooks/useAuth";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useRole from "../../hooks/useRole";
import Loader from "../../UI/Loader";
import BloodBridgeLogoFull from "./BloodBridgeLogoFull";

const DashboardSideMenu = ({ handleNavClick }) => {
  const [role, isRoleLoading] = useRole();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logOut()
      .then(() => {
        toast.success("Successfully logged out!");
        navigate("/");
        handleNavClick();
      })
      .catch(() => {
        toast.error("Failed to Logout");
      });
  };
  if (isRoleLoading) {
    return <Loader />;
  }
  let navLinks = [];

  if (role === "donor") {
    navLinks = [
      { name: "Overview", path: "/dashboard", end: true },
      { name: "Profile", path: "/dashboard/profile" },
      {
        name: "Create Donation Request",
        path: "/dashboard/create-donation-request",
      },
      { name: "My Donation Requests", path: "/dashboard/my-donation-request" },
    ];
  } else if (role === "admin") {
    navLinks = [
      { name: "Overview", path: "/dashboard", end: true },
      { name: "Profile", path: "/dashboard/profile" },
      { name: "All Users", path: "/dashboard/manage-users" },
      {
        name: "All Blood Donation Request",
        path: "/dashboard/all-blood-donation-request",
      },
      { name: "Content Management", path: "/dashboard/content-management" },
    ];
  } else if (role === "volunteer") {
    navLinks = [
      { name: "Overview", path: "/dashboard", end: true },
      { name: "Profile", path: "/dashboard/profile" },
      {
        name: "All Blood Donation Request",
        path: "/dashboard/all-blood-donation-request",
      },
      { name: "Content Management", path: "/dashboard/content-management" },
    ];
  }

  // Add exit link for all roles
  navLinks.push({ name: "Exit Dashboard", path: "/" });

  return (
    <menu className="w-96 h-screen bg-base-200 text-secondary p-6 flex flex-col shadow-xl shadow-primary/5 fixed top-0 left-0 overflow-y-auto">
      <div className="flex justify-center pb-2 border-b-4 border-dashed border-primary/40 mb-2">
        <button>
          <BloodBridgeLogoFull />
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {navLinks.map(({ name, path, end }, idx) => (
          <NavLink
            key={idx}
            to={path}
            end={end}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `hover:bg-primary/60 px-3 py-2 rounded ${
                isActive ? "bg-primary/90 text-base-100 font-semibold" : ""
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-16">
        <button
          onClick={handleSignOut}
          className="w-full bg-secondary hover:bg-primary/100 text-base-100 font-semibold py-2 rounded transition-all duration-200 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </menu>
  );
};

export default DashboardSideMenu;
