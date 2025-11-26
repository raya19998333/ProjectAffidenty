import React, { useState } from "react";
import "../App.css";
export default function Admin() {
  const [stats, setStats] = useState({
    students: 320,
    teachers: 25,
    sessions: 48,
    attendanceToday: 279,
  });
  const [recentSessions, setRecentSessions] = useState([
    { name: "Math 101", time: "08:00 AM", teacher: "Mr. Ali" },
    { name: "Database Systems", time: "10:00 AM", teacher: "Ms. Noor" },
    { name: "Programming 2", time: "01:00 PM", teacher: "Mr. Ahmed" },
  ]);
  const [recentUsers, setRecentUsers] = useState([
    { name: "Sara", role: "Student" },
    { name: "Reem", role: "Student" },
    { name: "Fahad", role: "Teacher" },
  ]);
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {/* TOP CARDS */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Total Students</p>
          <h2 className="card-value">{stats.students}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Teachers</p>
          <h2 className="card-value">{stats.teachers}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{stats.sessions}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Attendance Today</p>
          <h2 className="card-value">{stats.attendanceToday}</h2>
        </div>
      </div>
      {/* CHART */}
      <h2 className="panel-title" style={{ marginTop: "40px" }}>
        Weekly Attendance
      </h2>
      <div className="panel">
        <div className="chart">
          {[50, 80, 60, 90, 40, 70].map((value, index) => (
            <div className="chart-bar" key={index}>
              <div className="bar-fill" style={{ height: `${value}%` }}></div>
              <div className="bar-label">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"][index]}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* PANELS GRID */}
      <div className="admin-panels">
        {/* Recent Sessions */}
        <div className="panel">
          <h3 className="panel-title">Recent Sessions</h3>
          <div className="panel-list">
            {recentSessions.map((s, index) => (
              <div className="list-item" key={index}>
                <span>
                  <strong>{s.name}</strong> — {s.time}
                </span>
                <span style={{ color: "#0b4f9f" }}>{s.teacher}</span>
              </div>
            ))}
          </div>
        </div>
        {/* New Users */}
        <div className="panel">
          <h3 className="panel-title">New Users</h3>
          <div className="panel-list">
            {recentUsers.map((u, index) => (
              <div className="list-item" key={index}>
                <span>{u.name}</span>
                <span style={{ color: "#3b82f6", fontWeight: "600" }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* System Notes */}
        <div className="panel">
          <h3 className="panel-title">System Notes</h3>
          <p className="risk-note">• All systems operating normally.</p>
          <p className="risk-note">• Database: Healthy and optimized.</p>
          <p className="risk-note">• No suspicious activity detected.</p>
          <p className="risk-note">• 99.3% system uptime.</p>
        </div>
      </div>
    </div>
  );
}
