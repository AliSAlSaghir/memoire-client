import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleAuthToggle = mode => {
    navigate(`/?mode=${mode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Memoire Logo" className="logo-img" />
          <span className="logo-text">emoire</span>
        </Link>
        <Link to="/explore" className="explore-link">
          Explore
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        <div className="auth-buttons">
          <button
            className="btn login"
            onClick={() => handleAuthToggle("login")}
          >
            Login
          </button>
          <button
            className="btn signup"
            onClick={() => handleAuthToggle("register")}
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
