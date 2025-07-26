import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

export const useHeroSectionLogic = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRegister = searchParams.get("mode") === "register";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isRegister) {
        response = await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      localStorage.setItem("user", JSON.stringify(response.data.payload));

      toast.success(
        isRegister ? "Registered Successfully!" : "Logged in Successfully!"
      );

      navigate("/capsules");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "An error occurred";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleLoginURL = `http://localhost:8000/api/v0.1/auth/google/redirect`;

    window.open(googleLoginURL, "googleLogin", "width=500,height=600");

    const handleMessage = event => {
      const { user } = event.data;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in Successfully!");
        navigate("/capsules");
      }

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return {
    formData,
    loading,
    isRegister,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
};
