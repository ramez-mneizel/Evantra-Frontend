import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import { api } from "../api.js";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Alert from "../../components/Alert.jsx";


export default function DashboardHome() {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminHome user={user} />;
  if (user?.role === "moderator") return <ModeratorHome user={user} />;
  return <UserHome user={user} />;
}

function UserHome({ user }) {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api("/bookings/my").then(setBookings).catch(() => setBookings([]));
    api("/events").then((data) => setEvents(data.slice(0, 3))).catch(() => setEvents([]));
  }, []);

  const active = bookings.filter((b) => b.status === "confirmed");

  return (
    <>
      <h1>Welcome back, {user?.name}</h1>
      <div className="grid-3">
        <StatCard label="My Bookings" value={bookings.length} />
        <StatCard label="Active Bookings" value={active.length} />
        <StatCard label="Events Available" value={events.length} />
      </div>
      <h2 className="section">Latest Events</h2>
      {events.length === 0 ? (
        <p className="muted">No events yet.</p>
      ) : (
        <ul className="list">
          {events.map((ev) => (
            <li key={ev._id}>{ev.title} - {ev.location}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function AdminHome({ user }) {
  const [stats, setStats] = useState({ events: 0, users: 0, bookings: 0, pending: 0 });
  const [error, setError] = useState("");


  
useEffect(() => {
  
  const token = localStorage.getItem("token"); 

  const headers = { Authorization: `Bearer ${token}` };

  Promise.all([
    api("/events/management", { headers }), 
    api("/users", { headers }), 
    api("/bookings", { headers })
  ])
    .then(([events, users, bookings]) => {
      const pending = events.filter((e) => e.status === "pending").length;
    
      setStats({ events: events.length, users: users.length, bookings: bookings.length, pending: pending });
    })
  .catch ((err) => {
    console.error(err); 
    setError("حدث خطأ في جلب بعض البيانات"); 
  });
}, []);
      
  return (
    <>
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage your platform and keep everything running smoothly.</p>
      <Alert>{error}</Alert>
      <div className="grid-4">
        <StatCard label="Total Events" value={stats.events} />
        <StatCard label="Pending Approval" value={stats.pending} />
        <StatCard label="Total Users" value={stats.users} />
        <StatCard label="Total Bookings" value={stats.bookings} />
      </div>
    </>
  );
}

function ModeratorHome() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    api("/events/manage/all")
      .then(setEvents)
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const review = async (id, status) => {
    setError("");
    setMessage("");
    try {
      await api(`/events/${id}/review`, { method: "PUT", body: { status } });
      setMessage(`Event ${status}.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const pending = events.filter((e) => e.status === "pending").length;

  return (
    <>
      <h1>Moderator Dashboard</h1>
      <p className="muted">Review events and manage content.</p>
      <div className="grid-3">
        <StatCard label="Pending Approval" value={pending} />
        <StatCard label="Total Events" value={events.length} />
      </div>
      <Alert type="success">{message}</Alert>
      <Alert>{error}</Alert>
      <table className="table">
        <thead>
          <tr><th>Event</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.date ? ev.date.slice(0, 10) : ""}</td>
              <td><StatusBadge status={ev.status} /></td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => review(ev._id, "approved")}>Approve</button>{" "}
                <button className="btn btn-sm btn-outline" onClick={() => review(ev._id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
