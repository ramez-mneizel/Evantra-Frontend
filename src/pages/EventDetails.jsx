import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "./api.js";
import { useAuth } from "../AuthContext.jsx";
import { formatDate, formatPrice } from "../utils.js";
import Alert from "../components/Alert.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api(`/events/${id}`)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    setBooking(true);
    setError("");
    setMessage("");
    try {
      await api("/bookings", { method: "POST", body: { eventId: id } });
      setMessage("Booking confirmed! You can find it in My Bookings.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (!event) {
    return error ? <Alert>{error}</Alert> : <p className="muted">Loading...</p>;
  }

  const canBook = event.status === "approved" && (!user || user.role === "user");

  return (
    <div className="card details">
      <Link to="/events">Back to events</Link>
      <span className="tag">{event.category || "General"}</span>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <div className="details-grid">
        <div><span className="muted">Date</span><strong>{formatDate(event.date)}</strong></div>
        <div><span className="muted">Time</span><strong>{event.time || "-"}</strong></div>
        <div><span className="muted">Location</span><strong>{event.location}</strong></div>
        <div><span className="muted">Price</span><strong>{formatPrice(event.price)}</strong></div>
      </div>

      <Alert type="success">{message}</Alert>
      <Alert>{error}</Alert>

      {canBook && (
        <button className="btn btn-primary" onClick={handleBook} disabled={booking}>
          {booking ? "Booking..." : user ? "Book Now" : "Login to Book"}
        </button>
      )}
      {user && user.role !== "user" && (
        <p className="muted">Only regular users can book events.</p>
      )}
      {event.status !== "approved" && (
        <p className="muted">This event is not open for booking yet.</p>
      )}
    </div>
  );
}
