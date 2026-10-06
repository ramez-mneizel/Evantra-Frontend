import { useState } from "react";
import Alert from "../components/Alert.jsx";

// Demo form: the backend has no contact endpoint, so nothing is stored.
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setSent("Thank you! Your message has been submitted.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <h1>Contact Us</h1>
      <p className="muted">Have questions? We would love to hear from you.</p>
      <div className="grid-2 section">
        <div className="card">
          <h3>Get in touch</h3>
          <p><span className="muted">Email</span><br />support@eventify.com</p>
          <p><span className="muted">Phone</span><br />+962 7 1234 5678</p>
          <p><span className="muted">Location</span><br />Amman, Jordan</p>
        </div>
        <form className="card form" onSubmit={onSubmit}>
          <Alert type="success">{sent}</Alert>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required />
          <label>Message</label>
          <textarea name="message" rows="4" value={form.message} onChange={onChange} required />
          <button className="btn btn-primary" type="submit">Send Message</button>
        </form>
      </div>
    </>
  );
}
