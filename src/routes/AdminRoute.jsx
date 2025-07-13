import React from "react";
import { Navigate } from "react-router";
import Loader from "../UI/Loader";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) {
    return <Loader />;
  }

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
