import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  /* =============== THEME SYSTEM =============== */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("attendify-theme") || "light";
  });
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("attendify-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  /* =============== MOBILE MENU =============== */
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="main-header">
      {/* LOGO */}
      <div className="header-logo">
        <Link to="/">Attendify</Link>
      </div>
      {/* MENU BUTTON MOBILE */}

      {/* NAV LINKS */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/student"
          className={`nav-link ${
            location.pathname === "/student" ? "active" : ""
          }`}
        >
          Student
        </Link>
        <Link
          to="/teacher"
          className={`nav-link ${
            location.pathname === "/teacher" ? "active" : ""
          }`}
        >
          Teacher
        </Link>
        <Link
          to="/admin"
          className={`nav-link ${
            location.pathname === "/admin" ? "active" : ""
          }`}
        >
          Admin
        </Link>
        <Link
          to="/login"
          className={`nav-link ${
            location.pathname === "/login" ? "active" : ""
          }`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`nav-link ${
            location.pathname === "/register" ? "active" : ""
          }`}
        >
          Register
        </Link>
        {/* THEME TOGGLE BUTTON */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀"}
        </div>
      </nav>
    </header>
  );
};
export default Header;
