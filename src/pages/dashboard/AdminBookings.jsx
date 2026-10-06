import { useEffect, useState } from "react";
import { api } from "../api.js";
import { formatDate, formatPrice } from "../../utils.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Alert from "../../components/Alert.jsx";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/bookings").then(setBookings).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <h1>All Bookings</h1>
      <Alert>{error}</Alert>
      <table className="table">
        <thead>
          <tr><th>User</th><th>Event</th><th>Date</th><th>Price</th><th>Status</th></tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.name}<br /><span className="muted">{b.user?.email}</span></td>
              <td>{b.event?.title}</td>
              <td>{formatDate(b.event?.date)}</td>
              <td>{formatPrice(b.event?.price)}</td>
              <td><StatusBadge status={b.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
