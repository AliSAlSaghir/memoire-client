import { useNavigate } from "react-router-dom";

export const useNavbarLogic = () => {
  const navigate = useNavigate();

  const handleAuthToggle = mode => {
    navigate(`/?mode=${mode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    handleAuthToggle,
  };
};
