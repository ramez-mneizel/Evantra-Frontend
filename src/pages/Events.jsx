import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api.js";
import { CATEGORIES } from "../utils.js";
import EventCard from "../components/EventCard.jsx";
import Alert from "../components/Alert.jsx";

export default function Events() {
  const [params] = useSearchParams();
  const initial = { search: params.get("search") || "", category: "", location: "" };

  const [form, setForm] = useState(initial);
  const [filters, setFilters] = useState(initial); 
  const [sort, setSort] = useState("date");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.search) q.set("search", filters.search);
    if (filters.category) q.set("category", filters.category);
    if (filters.location) q.set("location", filters.location);

    setLoading(true);
    setError("");
    api(`/events?${q.toString()}`)
      .then((data) => {
    console.log("API Response:", data);
    setEvents(Array.isArray(data) ? data : data.events || []);
  })
  .catch((err) => console.error("API Error:", err))
  .finally(() => setLoading(false));
  }, [filters]);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters(form);
  };

  const reset = () => {
    const empty = { search: "", category: "", location: "" };
    setForm(empty);
    setFilters(empty);
  };


  const sorted = [...events].sort((a, b) =>
    sort === "price" ? a.price - b.price : new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <h1>Browse Events</h1>

      <form className="card filters" onSubmit={onSubmit}>
        <input name="search" placeholder="Search by title..." value={form.search} onChange={onChange} />
        <select name="category" value={form.category} onChange={onChange}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input name="location" placeholder="Location" value={form.location} onChange={onChange} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Sort by date</option>
          <option value="price">Sort by price</option>
        </select>
        <button className="btn btn-primary" type="submit">Search</button>
        <button className="btn btn-outline" type="button" onClick={reset}>Reset</button>
      </form>

      <Alert>{error}</Alert>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : sorted.length === 0 ? (
        <p className="muted">No events match your search.</p>
      ) : (
        <div className="grid-3">
          {sorted.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}
    </>
  );
}
