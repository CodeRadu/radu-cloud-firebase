import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  return currentUser ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
