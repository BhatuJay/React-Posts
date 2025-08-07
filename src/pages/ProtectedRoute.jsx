import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      setShouldRedirect(true); // First time: always redirect to login
    } else {
      setShouldRedirect(!currentUser); // If no currentUser, redirect to login
    }
  }, []);

  if (shouldRedirect === null) return null; // or loading spinner

  return shouldRedirect ? <Navigate to="/login" /> : children;
};