import "./styles.css";
import useProfile from ".";

const Profile = () => {
  const {
    username,
    email,
    photo,
    loading,
    handleSubmit,
    handlePhotoChange,
    setUsername,
  } = useProfile();

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
