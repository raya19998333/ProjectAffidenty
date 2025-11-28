import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Teacher from './Components/Teacher';
import Student from './Components/Student';
import Admin from './Components/Admin';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import { Navigate } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const hideLayout =
    location.pathname === '/login' || location.pathname === '/register';

  const [user, setUser] = useState(null);

  // تحميل المستخدم من localStorage عند بداية التطبيق
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // إعادة توجيه للصفحة الرئيسية
  };

  return (
    <>
      {!hideLayout && <Header user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher" element={<Teacher user={user} />} />
        <Route path="/student" element={<Student user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route
          path="/profile"
          element={
            user ? <Profile user={user} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
