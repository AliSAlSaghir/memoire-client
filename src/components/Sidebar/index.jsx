import { NavLink, useNavigate } from "react-router-dom";
import { RiHome2Line, RiHome2Fill } from "react-icons/ri";
import { IoMdAddCircleOutline, IoMdAddCircle } from "react-icons/io";
import { LiaCapsulesSolid } from "react-icons/lia";
import { HiOutlineKey } from "react-icons/hi2";
import { HiMiniKey } from "react-icons/hi2";
import { FaCapsules } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { RxAvatar } from "react-icons/rx";

import "./styles.css";
import logo from "/logo.svg";
import api from "../../services/axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };
  return (
    <nav className="sidebar">
      <div className="nav-top">
        <NavLink to="/capsules" className="app-icon" title="Memoire">
          <img src={logo} alt="Memoire Logo" className="logo-img" />
        </NavLink>

        <NavLink to="/capsules" className="nav-icon" title="Home">
          {({ isActive }) =>
            isActive ? <RiHome2Fill size={20} /> : <RiHome2Line size={20} />
          }
        </NavLink>

        <NavLink to="/create" className="nav-icon" title="Create">
          {({ isActive }) =>
            isActive ? (
              <IoMdAddCircle size={22} />
            ) : (
              <IoMdAddCircleOutline size={22} />
            )
          }
        </NavLink>

        <NavLink to="/my-capsules" className="nav-icon" title="Your Capsules">
          {({ isActive }) =>
            isActive ? <FaCapsules size={20} /> : <LiaCapsulesSolid size={20} />
          }
        </NavLink>

        <NavLink to="/unlisted" className="nav-icon" title="Get Unlisted">
          {({ isActive }) =>
            isActive ? <HiMiniKey size={20} /> : <HiOutlineKey size={20} />
          }
        </NavLink>
      </div>

      <div className="nav-bottom">
        <button className="nav-icon" title="Logout" onClick={handleLogout}>
          <TbLogout size={20} />
        </button>
        <NavLink to="/profile" className="nav-icon" title="Profile">
          <RxAvatar size={20} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
