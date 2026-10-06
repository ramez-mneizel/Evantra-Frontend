import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Footer from "./Footer.jsx";


const menus = {
  user: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/events", label: "Browse Events" },
    { to: "/my-bookings", label: "My Bookings" },
  ],
  moderator: [
    { to: "/dashboard", label: "Review Events" },
    { to: "/events", label: "Browse Events" },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin/events", label: "Manage Events" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/events", label: "Browse Events" },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // toggle sidebar

  const links = menus[user.role] || menus.user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dash">
      {open && (
        <aside className="sidebar">
          <Link to="/" className="brand light">Eventify</Link>
          <div className="sidebar-user">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
          <nav className="sidebar-nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </nav>
          <button className="sidebar-logout" onClick={handleLogout}>Log Out</button>
        </aside>
      )}

      <div className="dash-main">
        <div className="topbar">
          <button className="btn btn-outline btn-sm" onClick={() => setOpen(!open)}>
            {open ? "Hide Menu" : "Show Menu"}
          </button>
          <span>Welcome, <strong>{user.name}</strong></span>
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
