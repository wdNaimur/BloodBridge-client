import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const NavProfile = () => {
  const { user, logOut } = useAuth();
  const handleSignOut = () => {
    logOut();
  };
  return (
    <div className="flex items-center gap-2">
      <Link to="/dashboard/profile">
        <img
          className="h-10 w-10 rounded-full border-3 border-secondary"
          src={user.photoURL}
          alt={user.displayName}
        />
      </Link>
      <button
        className="btn btn-secondary text-base-200 border-none shadow-none uppercase"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

export default NavProfile;
