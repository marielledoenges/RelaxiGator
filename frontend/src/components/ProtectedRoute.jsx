import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, authVar }) => {
  if (!authVar) {
    // redierct to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  // render the protected page if authenticated
  return children;
};

export default ProtectedRoute;