import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./styles.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Left: Copyright */}
        <div className="footer-copy">
          &copy; {new Date().getFullYear()}{" "}
          <span className="memoire-hover">Memoire</span>. All rights reserved.
        </div>

        {/* Center: Navigation */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="/privacy-policy">Privacy</a>
          <a href="/terms-of-service">Terms</a>
          <a href="/support">Support</a>
        </nav>

        {/* Right: Social */}
        <div className="footer-social">
          <a
            href="https://x.com/dawouddaoud"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
          >
            <BsTwitterX size={18} aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/in/ali-alsaghir0/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/AliSAlSaghir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
