import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// This component restricts access to authenticated users only so only authenticated users can use the main app and chat features.
// - Redirects unauthenticated users to the login page.
// - Wraps protected content and renders it only if the user is logged in.

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/login");
    },
    [isAuthenticated, navigate]
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
