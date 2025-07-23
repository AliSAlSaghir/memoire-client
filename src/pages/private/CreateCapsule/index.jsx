import React from "react";
import "./styles.css";
import { useCreateCapsule } from ".";

const CreateCapsule = () => {
  const {
    form,
    isSubmitting,
    handleChange,
    handleFileChange,
    removeFile,
    handleSubmit,
  } = useCreateCapsule();

  return (
    <>
      <h1>Create Your Time Capsule</h1>
      <form className="capsule-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Capsule Title</label>
        <input
          type="text"
          id="title"
          name="title"
          maxLength={100}
          placeholder="Short title"
          value={form.title}
          onChange={handleChange}
        />

        <label htmlFor="message">Message to Future You</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
        />

        <label htmlFor="mood">Choose Your Mood</label>
        <input
          type="text"
          id="mood"
          name="mood"
          placeholder="e.g. Happy"
          value={form.mood}
          onChange={handleChange}
        />

        <label htmlFor="customEmoji">Choose Emoji</label>
        <input
          type="text"
          id="customEmoji"
          name="customEmoji"
          maxLength={2}
          placeholder="e.g. 🧡"
          value={form.customEmoji}
          onChange={handleChange}
        />

        <label htmlFor="color">Choose Color</label>
        <input
          type="color"
          id="color"
          name="color"
          value={form.color}
          onChange={handleChange}
        />

        <label htmlFor="images">Attach Images</label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="file-previews">
          {form.images.map((file, index) => (
            <div key={index} className="file-preview">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                width={50}
              />
              <button
                type="button"
                onClick={() => removeFile("images", index)}
                className="remove-btn"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <label htmlFor="audio">Attach Audio</label>
        <input
          type="file"
          id="audio"
          name="audio"
          accept="audio/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="file-previews">
          {form.audio.map((file, index) => (
            <div key={index} className="file-preview">
              <span>🎵 {file.name}</span>
              <button
                type="button"
                onClick={() => removeFile("audio", index)}
                className="remove-btn"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <label htmlFor="revealDate">Reveal Date & Time</label>
        <input
          type="datetime-local"
          id="revealDate"
          name="revealDate"
          value={form.revealDate}
          onChange={handleChange}
        />

        <fieldset>
          <legend>Privacy Settings</legend>
          <label>
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={form.privacy === "private"}
              onChange={handleChange}
            />
            Private
          </label>
          <label>
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={form.privacy === "public"}
              onChange={handleChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="privacy"
              value="unlisted"
              checked={form.privacy === "unlisted"}
              onChange={handleChange}
            />
            Unlisted
          </label>
        </fieldset>

        <label className="surprise-label">
          <input
            type="checkbox"
            id="surprise"
            name="surprise"
            checked={form.surprise}
            onChange={handleChange}
          />
          Enable Surprise Mode (Hide content until reveal)
        </label>

        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="happy, summer, vacation"
          value={form.tags}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Capsule"}
        </button>
      </form>
    </>
  );
};

export default CreateCapsule;
