import { useState } from "react";
import api from "../../../services/axios";
import { toast } from "react-toastify";

export function useCreateCapsule() {
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

  const handleFileChange = e => {
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

      const revealDate = new Date(form.revealDate);
      const revealAt = revealDate.toISOString();

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

  return {
    form,
    isSubmitting,
    handleChange,
    handleFileChange,
    removeFile,
    handleSubmit,
  };
}
