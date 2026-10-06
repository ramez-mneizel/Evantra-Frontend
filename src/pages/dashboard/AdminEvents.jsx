import { useEffect, useState } from "react";
import { api } from "../api.js";
import { CATEGORIES, formatDate, formatPrice } from "../../utils.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Alert from "../../components/Alert.jsx";

const empty = { title: "", description: "", category: CATEGORIES[0], location: "", date: "", time: "", price: 0 };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    api("/events/manage/all").then(setEvents).catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await api(`/events/${editingId}`, { method: "PUT", body: form });
        setMessage("Event updated.");
      } else {
        await api("/events", { method: "POST", body: form });
        setMessage("Event created.");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description,
      category: ev.category || CATEGORIES[0],
      location: ev.location,
      date: ev.date ? ev.date.slice(0, 10) : "",
      time: ev.time || "",
      price: ev.price || 0,
    });
  };

  const remove = async (id) => {
    setError("");
    try {
      await api(`/events/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Manage Events</h1>
      <Alert type="success">{message}</Alert>
      <Alert>{error}</Alert>

      <form className="card form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Event" : "Create Event"}</h3>
        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />
        <label>Description</label>
        <textarea name="description" rows="3" value={form.description} onChange={onChange} required />
        <div className="form-row">
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Location</label>
            <input name="location" value={form.location} onChange={onChange} required />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div>
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={onChange} />
          </div>
          <div>
            <label>Price</label>
            <input type="number" min="0" name="price" value={form.price} onChange={onChange} />
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary" type="submit">{editingId ? "Save Changes" : "Create Event"}</button>
          {editingId && <button className="btn btn-outline" type="button" onClick={resetForm}>Cancel Edit</button>}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr><th>Title</th><th>Date</th><th>Price</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{formatDate(ev.date)}</td>
              <td>{formatPrice(ev.price)}</td>
              <td><StatusBadge status={ev.status} /></td>
              <td>
                <button className="btn btn-sm btn-outline" onClick={() => edit(ev)}>Edit</button>{" "}
                <button className="btn btn-sm btn-outline" onClick={() => remove(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
