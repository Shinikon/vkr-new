import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "admin" || userRole === "manager") {
      return <Navigate to="/approvals" replace />;
    }
    return <Navigate to="/request" replace />;
  }
  return children;
};

export default ProtectedRoute;
