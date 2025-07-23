import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
