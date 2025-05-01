import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, requiredRole }) {
  const user = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
