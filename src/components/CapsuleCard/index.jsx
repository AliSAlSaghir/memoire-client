import React from "react";
import { useCapsuleCardLogic } from ".";
import "./styles.css";

const CapsuleCard = ({ capsule, onDeleteSuccess }) => {
  const {
    isSurprise,
    isRevealed,
    isCopying,
    isDeleting,
    privacy,
    handleCopyToken,
    handleDelete,
    goToCapsule,
  } = useCapsuleCardLogic(capsule, onDeleteSuccess);

  return (
    <div
      className={`capsule-card ${isSurprise ? "surprise" : ""} ${
        isRevealed ? "revealed" : ""
      }`}
    >
      <div className="capsule-header">
        <div className="capsule-title">
          {isSurprise ? "Hidden Surprise" : capsule.title}
        </div>
        <div className={`privacy-badge ${privacy.className}`}>
          {privacy.label}
        </div>
      </div>
      <div className="capsule-meta">
        Created:{" "}
        {new Date(capsule.created_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      <div className="capsule-meta">
        {isRevealed ? "Revealed" : "Reveal"}:{" "}
        {new Date(capsule.reveal_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>

      <div className="capsule-actions">
        {isSurprise ? (
          <>
            <div className="capsule-row">
              <button className="capsule-btn view-btn" disabled>
                Locked
              </button>
              <button className="capsule-btn edit-btn" disabled>
                Edit
              </button>
            </div>
            <div className="capsule-row">
              <button
                className="capsule-btn delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        ) : isRevealed ? (
          <>
            {capsule.privacy === "unlisted" ? (
              <button
                className="capsule-btn copy-btn"
                onClick={handleCopyToken}
                disabled={isCopying}
              >
                {isCopying ? "Copying..." : "Copy"}
              </button>
            ) : (
              <button className="capsule-btn view-btn" onClick={goToCapsule}>
                View
              </button>
            )}
            <button
              className="capsule-btn delete-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        ) : (
          <>
            <div className="capsule-row">
              <button className="capsule-btn view-btn" onClick={goToCapsule}>
                Preview
              </button>
              <button className="capsule-btn edit-btn">Edit</button>
            </div>
            <div className="capsule-row">
              <button
                className="capsule-btn delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CapsuleCard;
