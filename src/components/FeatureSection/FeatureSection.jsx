import React from "react";
import "./FeatureSection.css";

export default function FeatureSection({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  reversed,
}) {
  return (
    <section
      className={`feature-section ${
        reversed ? "section-right" : "section-left"
      }`}
    >
      {!reversed && (
        <div className="content">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="buttons">
            <button onClick={() => (window.location.href = buttonLink)}>
              {buttonText}
            </button>
          </div>
        </div>
      )}

      <div className="image-side">
        <img src={imageUrl} alt={title} />
      </div>

      {reversed && (
        <div className="content">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="buttons">
            <button onClick={() => (window.location.href = buttonLink)}>
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
