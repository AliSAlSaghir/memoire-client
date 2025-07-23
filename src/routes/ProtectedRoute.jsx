import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [show, setShow] = useState(true);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.warn("Log in First!");
      setShow(false);
    }
  }, [user]);

  if (!user && !show) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
