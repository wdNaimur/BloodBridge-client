import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../UI/Loader";

const NavProfile = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const fetchUser = async () => {
    const { data } = await axiosSecure.get(`/user/${user.email}`);
    return data;
  };

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user", user.email],
    queryFn: fetchUser,
  });
  console.log(profileData);

  const handleSignOut = () => {
    logOut();
    setOpen(false);
  };

  // Close dropdown on outside click (still useful for keyboard nav or unexpected edge cases)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative font-Poppins" ref={dropdownRef}>
      {/* Avatar Button */}
      <div
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-circle avatar cursor-pointer"
      >
        <div className="w-10 rounded-full border-2 border-secondary">
          <img
            src={profileData?.image}
            alt={user?.displayName || "User Avatar"}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[90] h-screen w-screen -top-6 -left-6 "
            onClick={() => setOpen(false)}
          />

          {/* Dropdown Menu */}
          <ul className="absolute right-0 mt-3 z-[100] p-2 shadow-2xl shadow-primary/10 menu dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <Link to="/dashboard/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <button
                className="btn btn-secondary text-base-200 border-none shadow-none mt-2"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default NavProfile;
