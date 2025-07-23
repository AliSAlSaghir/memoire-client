import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/axios";
import "./styles.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CapsuleDetails = () => {
  const { capsuleId, token } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const identifier = capsuleId || token;

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

  if (isLoading) return <div className="capsule-container">Loading...</div>;
  if (!capsule)
    return <div className="capsule-container">Capsule not found.</div>;

  const {
    title,
    message,
    emoji,
    reveal_at,
    created_at,
    user,
    tags,
    attachments,
    location,
  } = capsule;

  const imageAttachments =
    attachments?.filter(att => att.type === "image") || [];
  const audioAttachments =
    attachments?.filter(att => att.type === "audio") || [];

  const visibleImages =
    imageAttachments.length > 4
      ? imageAttachments.slice(0, 3)
      : imageAttachments;
  const remainingCount = imageAttachments.length - 3;
  const hasMore = imageAttachments.length > 4;

  const gridClass = `image-grid image-count-${imageAttachments.length}`;

  const formatDate = dateStr => {
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
    if (!attachments || attachments.length === 0) {
      toast.warn("No attachments to export.");
      return;
    }

    const zip = new JSZip();
    setIsExporting(true);

    try {
      for (let i = 0; i < attachments.length; i++) {
        const { url, name, type, id } = attachments[i];

        // Extract filename from URL
        const filename = url.split("/").pop();

        // Use API endpoint to download through your backend
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
      saveAs(zipBlob, `${title || "capsule"}-attachments.zip`);
      toast.success("Export completed successfully!");
    } catch (err) {
      toast.error("Failed to generate ZIP file.");
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="capsule-container">
      <h1 className="capsule-name">
        {emoji} {title}
      </h1>
      <p className="capsule-date">Created on: {formatDate(created_at)}</p>
      <p className="capsule-date">Reveals at: {formatDate(reveal_at)}</p>
      {user?.name && <p className="capsule-date">By: {user.name}</p>}
      {location?.country && (
        <p className="capsule-date">
          Location: {location.city ? `${location.city}, ` : ""}
          {location.country}
        </p>
      )}
      {tags?.length > 0 && (
        <p className="capsule-date">Tags: {tags.join(", ")}</p>
      )}

      <div className="capsule-content">
        <p className="capsule-description">{message}</p>

        <div className="capsule-media">
          {imageAttachments.length > 0 && (
            <div className={gridClass}>
              {visibleImages.map((img, i) => (
                <img key={i} src={img.url} alt={`Memory ${i + 1}`} />
              ))}
              {hasMore && (
                <div
                  className="image-overlay"
                  title={`+${remainingCount} more`}
                >
                  <img src={imageAttachments[3].url} alt="More Preview" />
                  <div className="overlay-text">+{remainingCount}</div>
                </div>
              )}
            </div>
          )}

          {audioAttachments.length > 0 && (
            <div className="audio-list">
              {audioAttachments.map((audio, i) => (
                <audio key={i} controls>
                  <source src={audio.url} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              ))}
            </div>
          )}
        </div>

        <button
          className="export-btn"
          onClick={handleExportZip}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export as ZIP"}
        </button>
      </div>
    </div>
  );
};

export default CapsuleDetails;
