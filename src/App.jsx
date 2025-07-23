import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Explore from "./pages/public/Explore";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import CreateCapsule from "./pages/private/CreateCapsule";
import Profile from "./pages/private/Profile";
import CapsuleDetails from "./pages/private/CapsuleDetails";
import CapsuleWall from "./pages/private/CapsuleWall";
import MyCapsules from "./pages/private/MyCapsules";
import { ToastContainer } from "react-toastify";
import UnlistedCapsule from "./pages/private/UnlistedCapsule";
import SessionHandler from "./components/SessionHandler";

function App() {
  return (
    <Router>
      <SessionHandler />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/capsules" element={<CapsuleWall />} />
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="/my-capsules" element={<MyCapsules />} />
          <Route path="/capsules/:capsuleId" element={<CapsuleDetails />} />
          <Route path="/unlisted_capsule/:token" element={<CapsuleDetails />} />
          <Route path="/unlisted" element={<UnlistedCapsule />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
