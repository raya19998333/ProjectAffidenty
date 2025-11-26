import "../App.css";

import { useState } from "react";
export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    alert("Register submitted (UI only, no backend)");
  }
  return (
    <div className="register-wrapper">
      <section className="register-section">
        <div className="register-card">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join Attendify in seconds</p>
          <form className="register-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Full Name
              <input
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Email
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Role
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="form-label">
              Password
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn register-btn">
              Register
            </button>
          </form>
          <p className="register-bottom-text">
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
