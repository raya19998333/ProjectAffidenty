import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const location = useLocation();

  /* =============== THEME SYSTEM =============== */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('attendify-theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('attendify-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /* =============== MOBILE MENU =============== */
  const [menuOpen] = useState(false);

  return (
    <header className="main-header">
      {/* LOGO */}
      <div className="header-logo">
        <Link to="/">Attendify</Link>
      </div>

      {/* NAV LINKS */}
      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className={`nav-link ${
                location.pathname === '/login' ? 'active' : ''
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`nav-link ${
                location.pathname === '/register' ? 'active' : ''
              }`}
            >
              Register
            </Link>
          </>
        )}

        {/* Profile Link only if logged in */}
        {user && (
          <>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </>
        )}

        {user?.role === 'student' && (
          <Link to="/student" className="nav-link">
            Student
          </Link>
        )}
        {user?.role === 'teacher' && (
          <Link to="/teacher" className="nav-link">
            Teacher
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}

        {user && (
          <button className="nav-link logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}

        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀'}
        </div>
      </nav>
    </header>
  );
};

export default Header;
