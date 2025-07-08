import React from "react";
import { Navigate, useLocation } from "react-router";

import useAuth from "../hooks/useAuth";
import Loader from "../UI/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location.pathname, fromPrivateRoute: true }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
