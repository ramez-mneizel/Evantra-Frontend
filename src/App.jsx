import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import MyBookings from "./pages/dashboard/MyBookings.jsx";
import AdminEvents from "./pages/dashboard/AdminEvents.jsx";
import AdminUsers from "./pages/dashboard/AdminUsers.jsx";
import AdminBookings from "./pages/dashboard/AdminBookings.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public pages: header + footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Logged-in pages: sidebar layout, each route limited by role */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route
          path="/my-bookings"
          element={<ProtectedRoute roles={["user"]}><MyBookings /></ProtectedRoute>}
        />
        <Route
          path="/admin/events"
          element={<ProtectedRoute roles={["admin"]}><AdminEvents /></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>}
        />
        <Route
          path="/admin/bookings"
          element={<ProtectedRoute roles={["admin"]}><AdminBookings /></ProtectedRoute>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
