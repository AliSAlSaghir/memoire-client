import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const useCapsuleDetailsLogic = () => {
  const { capsuleId, token } = useParams();
  const identifier = capsuleId || token;

  const [capsule, setCapsule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const res = await api.get(`/capsules/${identifier}`);
        setCapsule(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch capsule.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapsule();
  }, [identifier]);

  const formatDate = dateStr => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleExportZip = async () => {
    if (!capsule?.attachments || capsule.attachments.length === 0) {
      toast.warn("No attachments to export.");
      return;
    }

    const zip = new JSZip();
    setIsExporting(true);

    try {
      for (let i = 0; i < capsule.attachments.length; i++) {
        const { url, name, type } = capsule.attachments[i];

        const filename = url.split("/").pop();

        const response = await api.get(`/capsule_attachments/${filename}`, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const folder = zip.folder(type === "image" ? "images" : "audio");
        const fileName =
          name || `file-${i}.${type === "image" ? "jpg" : "mp3"}`;

        folder.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${capsule.title || "capsule"}-attachments.zip`);
      toast.success("Export completed successfully!");
    } catch (err) {
      toast.error("Failed to generate ZIP file.");
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const imageAttachments =
    capsule?.attachments?.filter(att => att.type === "image") || [];

  const audioAttachments =
    capsule?.attachments?.filter(att => att.type === "audio") || [];

  const visibleImages =
    imageAttachments.length > 4
      ? imageAttachments.slice(0, 3)
      : imageAttachments;
  const remainingCount = imageAttachments.length - 3;
  const hasMore = imageAttachments.length > 4;

  return {
    capsule,
    isLoading,
    isExporting,
    formatDate,
    handleExportZip,
    imageAttachments,
    audioAttachments,
    visibleImages,
    remainingCount,
    hasMore,
  };
};
