import { GiSandsOfTime, GiMailbox } from "react-icons/gi";
import CapsuleCard from "../../../components/CapsuleCard/index.jsx";
import "./styles.css";
import useMyCapsules from ".";

const MyCapsules = () => {
  const { isLoading, upcomingCapsules, revealedCapsules, handleCapsuleDelete } =
    useMyCapsules();

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
