// components/HeroSection/HeroSection.jsx
import "./styles.css";
import { useHeroSectionLogic } from ".";

const HeroSection = () => {
  const {
    formData,
    loading,
    isRegister,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  } = useHeroSectionLogic();

  return (
    <section className="hero">
      <h1>
        {isRegister
          ? "Join Memoire to save your memories"
          : "Log in to unlock your past and future memories"}
      </h1>

      <div className={`login-wrapper ${isRegister ? "register" : ""}`}>
        <h2>{isRegister ? "Create Your Account" : "Welcome to Memoire"}</h2>

        <form autoComplete="off" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                autoComplete="new-name"
                value={formData.name}
                onChange={handleChange}
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="or">OR</div>

        <div className="social">
          <button onClick={handleGoogleLogin}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-18.3-1.5-36-4.4-53.2H272v100.8h146.9c-6.3 34.1-25.2 63-53.6 82.4v68.2h86.4c50.6-46.6 81.8-115.2 81.8-198.2z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.8 0 133.8-24.1 178.4-65.5l-86.4-68.2c-24.1 16.2-55 25.8-92 25.8-70.7 0-130.6-47.8-152.1-112.1h-89v70.4c44.7 89.2 137.4 149.6 241.1 149.6z"
              />
              <path
                fill="#fbbc04"
                d="M119.9 324.3c-10.4-30.6-10.4-63.8 0-94.4v-70.4h-89c-39.5 77.5-39.5 167.6 0 245.1l89-70.3z"
              />
              <path
                fill="#ea4335"
                d="M272 107.2c39.7 0 75.5 13.7 103.5 40.6l77.6-77.6C405.8 23.8 346.3 0 272 0 168.3 0 75.6 60.4 30.9 149.6l89 70.4c21.5-64.3 81.4-112.1 152.1-112.1z"
              />
            </svg>
            {isRegister ? "Sign Up with Google" : "Continue with Google"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
