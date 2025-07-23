import React from "react";
import { useCapsuleDetailsLogic } from ".";
import "./styles.css";

const CapsuleDetails = () => {
  const {
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
  } = useCapsuleDetailsLogic();

  if (isLoading) return <div className="capsule-container">Loading...</div>;
  if (!capsule)
    return <div className="capsule-container">Capsule not found.</div>;

  const { title, message, emoji, reveal_at, created_at, user, tags, location } =
    capsule;

  const gridClass = `image-grid image-count-${imageAttachments.length}`;

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
