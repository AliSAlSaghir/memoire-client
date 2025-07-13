import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Explore from "./pages/public/Explore";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Home from "./pages/private/Home";
import CreateCapsule from "./pages/private/CreateCapsule";
import Profile from "./pages/private/Profile";
import CapsuleDetails from "./pages/private/CapsuleDetails";
import CapsuleWall from "./pages/private/CapsuleWall";

function App() {
  return (
    <Router>
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
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="/capsules" element={<CapsuleWall />} />
          <Route path="/capsules/:capsuleId" element={<CapsuleDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
