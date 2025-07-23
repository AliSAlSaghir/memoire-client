import { GiSandsOfTime, GiMailbox } from "react-icons/gi";
import CapsuleCard from "../../../components/CapsuleCard";
import "./styles.css";
import { useState, useEffect } from "react";
import api from "../../../services/axios";
import { toast } from "react-toastify";

const MyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [upcomingCapsules, setUpcomingCapsules] = useState([]);
  const [revealedCapsules, setRevealedCapsules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserCapsules = async () => {
      try {
        setIsLoading(true);
        // Get user ID from localStorage
        const userInfo = JSON.parse(localStorage.getItem("user"));
        if (!userInfo || !userInfo.id) {
          toast.error("Please login to view your capsules");
          return;
        }

        // Create a new API endpoint that returns all user capsules
        const response = await api.get(`/users/${userInfo.id}/capsules`);

        // Filter capsules based on current date
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
    // Remove from both upcoming and revealed capsules
    setUpcomingCapsules(prev =>
      prev.filter(capsule => capsule.id !== deletedId)
    );
    setRevealedCapsules(prev =>
      prev.filter(capsule => capsule.id !== deletedId)
    );
  };

  return (
    <>
      <div className="header">
        <h1>Your Time Capsules</h1>
      </div>

      <section className="capsule-section">
        <h2 className="section-heading">
          <GiSandsOfTime className="section-icon" />
          Upcoming Capsules
        </h2>

        {isLoading ? (
          <div className="loading-placeholder">
            Loading upcoming capsules...
          </div>
        ) : upcomingCapsules.length > 0 ? (
          <div className="capsule-grid">
            {upcomingCapsules.map(capsule => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDeleteSuccess={handleCapsuleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming capsules yet</p>
            <a href="/create" className="create-link">
              Create your first capsule
            </a>
          </div>
        )}
      </section>

      <section className="capsule-section">
        <h2 className="section-heading">
          <GiMailbox className="section-icon" />
          Revealed Capsules
        </h2>

        {isLoading ? (
          <div className="loading-placeholder">
            Loading revealed capsules...
          </div>
        ) : revealedCapsules.length > 0 ? (
          <div className="capsule-grid">
            {revealedCapsules.map(capsule => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDeleteSuccess={handleCapsuleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No capsules have been revealed yet</p>
            <p>
              Your memories will appear here when they're ready to be opened
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default MyCapsules;
