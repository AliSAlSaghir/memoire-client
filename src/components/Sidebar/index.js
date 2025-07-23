// components/Sidebar/useSidebarLogic.js
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

export const useSidebarLogic = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return {
    handleLogout,
  };
};
