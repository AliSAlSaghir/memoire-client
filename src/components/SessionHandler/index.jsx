// components/SessionHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

const SessionHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get("/auth/check_token");
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/", { replace: true });
        }
      }
    };

    const user = localStorage.getItem("user");

    if (user) {
      checkToken();
    }
  }, [navigate]);

  return null;
};

export default SessionHandler;
