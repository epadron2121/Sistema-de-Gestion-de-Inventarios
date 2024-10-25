import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
