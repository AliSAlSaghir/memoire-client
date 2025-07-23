import { useEffect, useState } from "react";
import api from "../../../services/axios";
import { toast } from "react-toastify";
import "./styles.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert file to base64
  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUsername(user.name || "");
      setEmail(user.email || "");
      setPhoto(user.profile_picture_url || "https://via.placeholder.com/150");
    }
  }, []);

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (photo.startsWith("blob:") && photoFile) {
        URL.revokeObjectURL(photo);
      }
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Start loading

    let base64Image = null;
    if (photoFile) {
      try {
        base64Image = await fileToBase64(photoFile);
      } catch (error) {
        console.error("Image conversion error:", error);
        toast.error("Failed to process image");
        setLoading(false); // Stop loading
        return;
      }
    }

    const payload = {
      name: username,
      ...(base64Image && { profile_picture: base64Image }),
    };

    try {
      const response = await api.put(`/updateMe`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedUser = response.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...updatedUser,
          avatar: updatedUser.profile_picture_url,
        })
      );

      setPhoto(
        updatedUser.profile_picture_url || "https://via.placeholder.com/150"
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Profile</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="avatar-wrapper">
          <label htmlFor="photo" className="avatar-label">
            <img src={photo} alt="Profile" className="avatar" />
            <span className="avatar-overlay">Change</span>
            <input
              type="file"
              id="photo"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" disabled value={email} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" disabled value="••••••••" />
        </div>

        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </>
  );
};

export default Profile;
