import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1>Welcome Back</h1>
      <p className="muted">Login to your account to continue.</p>
      <Alert>{error}</Alert>
      <form onSubmit={onSubmit} className="form">
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="muted">
        Do not have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
