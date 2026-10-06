import { useEffect, useState } from "react";
import { api } from "../api.js";
import Alert from "../../components/Alert.jsx";

const ROLES = ["user", "moderator", "admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api("/users").then(setUsers).catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const changeRole = async (id, role) => {
    setError("");
    try {
      await api(`/users/${id}/role`, { method: "PUT", body: { role } });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Users</h1>
      <Alert>{error}</Alert>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td>
                <button className="btn btn-sm btn-outline" onClick={() => remove(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
