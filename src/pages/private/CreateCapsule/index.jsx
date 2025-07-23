import React, { useState } from "react";
import "./styles.css";
import api from "../../../services/axios";
import { toast } from "react-toastify";

const CreateCapsule = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    mood: "",
    customEmoji: "",
    color: "#215d82",
    revealDate: "",
    privacy: "private",
    surprise: false,
    tags: "",
    images: [],
    audio: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async e => {
    const { name, files } = e.target;
    setForm(prev => ({ ...prev, [name]: [...prev[name], ...files] }));
  };

  const removeFile = (type, index) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert files to base64
      const imageAttachments = await Promise.all(
        form.images.map(async file => ({
          type: "image",
          base64: await fileToBase64(file),
        }))
      );

      const audioAttachments = await Promise.all(
        form.audio.map(async file => ({
          type: "audio",
          base64: await fileToBase64(file),
        }))
      );

      const attachments = [...imageAttachments, ...audioAttachments];

      // Format date to ISO string (UTC)
      const revealDate = new Date(form.revealDate);
      const revealAt = revealDate.toISOString();

      // Prepare payload
      const payload = {
        title: form.title,
        message: form.message,
        emoji: form.customEmoji,
        color: form.color,
        mood: form.mood,
        privacy: form.privacy,
        surprise: form.surprise,
        tags: form.tags,
        reveal_at: revealAt,
        attachments,
      };

      const response = await api.post("/capsules", payload);
      if (response) {
        toast.success("Capsule created successfully!");

        setForm({
          title: "",
          message: "",
          mood: "",
          customEmoji: "",
          color: "#215d82",
          revealDate: "",
          privacy: "private",
          surprise: false,
          tags: "",
          images: [],
          audio: [],
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create capsule");
    } finally {
      setIsSubmitting(false);
    }
  };

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
