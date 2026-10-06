import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../utils.js";

export default function EventCard({ event }) {
  return (
    <div className="card event-card">
      <span className="tag">{event.category || "General"}</span>
      <h3>{event.title}</h3>
      <p className="muted">
        {formatDate(event.date)}
        {event.time ? ` - ${event.time}` : ""}
      </p>
      <p className="muted">{event.location}</p>
      <div className="event-card-footer">
        <strong>{formatPrice(event.price)}</strong>
        <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}
