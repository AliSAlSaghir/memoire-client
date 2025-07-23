import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

export const useCapsuleCardLogic = (capsule, onDeleteSuccess) => {
  const navigate = useNavigate();

  const isSurprise = capsule.type === "surprise";
  const isRevealed = capsule.type === "revealed";

  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const privacyConfig = {
    private: { label: "Private", className: "privacy-private" },
    public: { label: "Public", className: "privacy-public" },
    unlisted: { label: "Unlisted", className: "privacy-unlisted" },
  };

  const privacy = privacyConfig[capsule.privacy] || privacyConfig.private;

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

  const goToCapsule = () => {
    navigate(`/capsules/${capsule.id}`);
  };

  return {
    isSurprise,
    isRevealed,
    isCopying,
    isDeleting,
    privacy,
    handleCopyToken,
    handleDelete,
    goToCapsule,
  };
};
