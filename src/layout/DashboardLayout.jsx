import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import useAuth from "../hooks/useAuth";
import Loader from "../UI/Loader";

const DashboardLayout = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="text-secondary bg-base-100 p-5 font-poppins min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>{/* <Footer /> */}</footer>
    </div>
  );
};

export default DashboardLayout;
