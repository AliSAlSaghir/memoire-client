import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.warn("Log in First!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
