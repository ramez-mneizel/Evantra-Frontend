import { useEffect, useState } from "react";
import { api } from "../api.js";
import { formatDate, formatPrice } from "../../utils.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Alert from "../../components/Alert.jsx";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api("/bookings/my")
      .then(setBookings)
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    setError("");
    try {
      await api(`/bookings/${id}/cancel`, { method: "PUT" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>My Bookings</h1>
      <Alert>{error}</Alert>
      {bookings.length === 0 ? (
        <p className="muted">You have not booked any events yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Event</th><th>Date</th><th>Price</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.event?.title}</td>
                <td>{formatDate(b.event?.date)}</td>
                <td>{formatPrice(b.event?.price)}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  {b.status === "confirmed" && (
                    <button className="btn btn-sm btn-outline" onClick={() => cancel(b._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
