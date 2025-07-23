import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUnlistedLogic = () => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsSubmitting(true);

    if (token.length >= 10) {
      navigate(`/unlisted_capsule/${token}`);
    } else {
      alert("Please enter a valid token");
      setIsSubmitting(false);
    }
  };

  return {
    token,
    isSubmitting,
    setToken,
    handleSubmit,
  };
};
