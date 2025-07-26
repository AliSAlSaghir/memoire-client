import { useEffect, useState } from "react";
import api from "../../../services/axios";
import { toast } from "react-toastify";

const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const useProfile = () => {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUsername(user.name || "");
      setEmail(user.email || "");
      setPhoto(
        user.profile_picture_url ||
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
      );
    }
  }, []);

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (photo?.startsWith("blob:") && photoFile) {
        URL.revokeObjectURL(photo);
      }
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    let base64Image = null;
    if (photoFile) {
      try {
        base64Image = await fileToBase64(photoFile);
      } catch (error) {
        console.error("Image conversion error:", error);
        toast.error("Failed to process image");
        setLoading(false);
        return;
      }
    }

    const payload = {
      name: username,
      profile_picture: base64Image,
    };

    try {
      const response = await api.put(`/updateMe`, payload);

      const updatedUser = response.data.payload.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...updatedUser,
          avatar: updatedUser.profile_picture_url,
        })
      );

      setPhoto(
        updatedUser.profile_picture_url ||
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    email,
    photo,
    loading,
    handleSubmit,
    handlePhotoChange,
    setUsername,
  };
};

export default useProfile;
