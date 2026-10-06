import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1>Create Account</h1>
      <p className="muted">Join Eventify and start booking events.</p>
      <Alert>{error}</Alert>
      <form onSubmit={onSubmit} className="form">
        <label>Full name</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <label>Confirm password</label>
        <input type="password" name="confirm" value={form.confirm} onChange={onChange} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
