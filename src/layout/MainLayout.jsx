import React from "react";
import Navbar from "../components/shared/Navbar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Loader from "../UI/Loader";
import useRole from "../hooks/useRole";

const MainLayout = () => {
  const { loading } = useAuth();
  const [role, isRoleLoading] = useRole();
  if (loading || isRoleLoading) {
    return <Loader />;
  }
  return (
    <div className="text-secondary bg-base-100 p-5 font-poppins min-h-screen flex flex-col overflow-x-hidden">
      <Toaster />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>{/* <Footer /> */}</footer>
    </div>
  );
};

export default MainLayout;
