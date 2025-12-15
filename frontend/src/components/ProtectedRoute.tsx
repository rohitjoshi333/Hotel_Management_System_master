import type { ReactElement } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactElement;
  message?: string;
  requireAdmin?: boolean;
  allowAdminOnUserPages?: boolean;
};

const ProtectedRoute = ({
  children,
  message = "Please log in or sign up first.",
  requireAdmin = false,
  allowAdminOnUserPages = true,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? (JSON.parse(rawUser) as { is_staff?: boolean }) : null;
  const isAuthenticated = Boolean(token);
  const isAdmin = Boolean(user?.is_staff);

  useEffect(() => {
    if (!isAuthenticated) {
      alert(message);
    } else if (requireAdmin && !isAdmin) {
      alert("Admin access required.");
    }
  }, [isAuthenticated, isAdmin, message, requireAdmin]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!requireAdmin && isAdmin && !allowAdminOnUserPages) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;