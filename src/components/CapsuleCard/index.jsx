import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../../services/axios";
import "./styles.css";

const CapsuleCard = ({ capsule, onDeleteSuccess }) => {
  const isSurprise = capsule.type === "surprise";
  const isRevealed = capsule.type === "revealed";
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const privacyConfig = {
    private: { label: "Private", className: "privacy-private" },
    public: { label: "Public", className: "privacy-public" },
    unlisted: { label: "Unlisted", className: "privacy-unlisted" },
  };

  const privacy = privacyConfig[capsule.privacy] || privacyConfig.private;

  // Handle token copying for unlisted capsules
  const handleCopyToken = async () => {
    setIsCopying(true);
    try {
      const response = await api.get(`/capsules/${capsule.id}/share-token`);
      const { share_token } = response.data;
      await navigator.clipboard.writeText(share_token);
      toast.success("Share token copied to clipboard!");
    } catch (error) {
      toast.error(error.message || "Failed to copy token");
    } finally {
      setIsCopying(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/capsules/${capsule.id}`);
      toast.success("Capsule deleted successfully!");
      if (onDeleteSuccess) {
        onDeleteSuccess(capsule.id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete capsule");
    } finally {
      setIsDeleting(false);
    }
  };

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
              <button
                className="capsule-btn view-btn"
                onClick={() => navigate(`/capsules/${capsule.id}`)}
              >
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
              <button
                className="capsule-btn view-btn"
                onClick={() => navigate(`/capsules/${capsule.id}`)}
              >
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
