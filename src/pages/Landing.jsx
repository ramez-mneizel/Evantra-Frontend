import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "./api.js";
import { useAuth } from "../AuthContext.jsx";
import EventCard from "../components/EventCard.jsx";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api("/events")
      .then((data) => setEvents(data.slice(0, 3)))
      .catch(() => setEvents([]));
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <section className="hero">
        <h1>Find &amp; Book Amazing Events</h1>
        <p>Discover concerts, workshops, conferences and more, all in one place.</p>
        <form className="hero-search" onSubmit={onSearch}>
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
        {!user && (
          <p>
            <Link to="/register" className="btn btn-outline">Create a free account</Link>
          </p>
        )}
      </section>

      <section className="grid-3 section">
        <div className="card">
          <h3>Wide Range of Events</h3>
          <p className="muted">Music, conferences, workshops, food festivals and more.</p>
        </div>
        <div className="card">
          <h3>Easy Booking</h3>
          <p className="muted">Book your seat in one click and manage everything from your dashboard.</p>
        </div>
        <div className="card">
          <h3>Reviewed Events</h3>
          <p className="muted">Every event is checked by a moderator before it goes live.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Latest Events</h2>
          <Link to="/events">View all</Link>
        </div>
        {events.length === 0 ? (
          <p className="muted">No events available yet.</p>
        ) : (
          <div className="grid-3">
            {events.map((ev) => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
