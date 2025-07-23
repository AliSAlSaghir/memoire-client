import { useState, useEffect } from "react";
import api from "../../../services/axios";
import { toast } from "react-toastify";

const useMyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [upcomingCapsules, setUpcomingCapsules] = useState([]);
  const [revealedCapsules, setRevealedCapsules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserCapsules = async () => {
      try {
        setIsLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("user"));

        if (!userInfo || !userInfo.id) {
          toast.error("Please login to view your capsules");
          return;
        }

        const response = await api.get(`/users/${userInfo.id}/capsules`);

        const now = new Date();
        const upcoming = [];
        const revealed = [];

        response.data.data.forEach(capsule => {
          const revealDate = new Date(capsule.reveal_at);
          if (revealDate > now) {
            upcoming.push({
              ...capsule,
              type: capsule.surprise ? "surprise" : "upcoming",
            });
          } else {
            revealed.push({
              ...capsule,
              type: "revealed",
            });
          }
        });

        setUpcomingCapsules(upcoming);
        setRevealedCapsules(revealed);
        setCapsules(response.data.data);
      } catch (error) {
        console.error("Failed to fetch capsules:", error);
        toast.error("Failed to load your capsules. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCapsules();
  }, []);

  const handleCapsuleDelete = deletedId => {
    setUpcomingCapsules(prev => prev.filter(c => c.id !== deletedId));
    setRevealedCapsules(prev => prev.filter(c => c.id !== deletedId));
  };

  return {
    isLoading,
    upcomingCapsules,
    revealedCapsules,
    handleCapsuleDelete,
  };
};

export default useMyCapsules;
