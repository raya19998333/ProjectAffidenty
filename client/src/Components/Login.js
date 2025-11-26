import "../App.css";

import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    alert("Login submitted (no backend yet)");
  }
  return (
    <div className="login-wrapper">
      <section className="login-section">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Login to your Attendify account</p>
          <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn login-btn">
              Login
            </button>
          </form>
          <p className="login-bottom-text">
            Don’t have an account?{" "}
            <a href="/register" className="register-link">
              Register
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
