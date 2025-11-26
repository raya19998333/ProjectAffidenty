import React, { useState } from "react";
import AttendifyLogo from "../Images/AttwndifyLogo.svg";
import "../App.css";
export default function Teacher() {
  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionRoom, setSessionRoom] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessions, setSessions] = useState([
    {
      name: "Math 101",
      time: "08:00 AM",
      room: "A12",
      date: "2025-02-01",
      code: "X92KD",
    },
  ]);
  // Generate random code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };
  const handleCreateSession = () => {
    if (
      !sessionName.trim() ||
      !sessionTime.trim() ||
      !sessionRoom.trim() ||
      !sessionDate.trim()
    )
      return;
    const newSession = {
      name: sessionName,
      time: sessionTime,
      room: sessionRoom,
      date: sessionDate,
      code: generateCode(),
    };
    setSessions([...sessions, newSession]);
    setShowModal(false);
    // reset fields
    setSessionName("");
    setSessionTime("");
    setSessionRoom("");
    setSessionDate("");
  };
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Teacher Dashboard</h1>
      {/* TOP CARDS */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{sessions.length}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Today's Students</p>
          <h2 className="card-value green">32</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Rating</p>
          <h2 className="card-value">4.9</h2>
        </div>
      </div>
      {/* CREATE SESSION BOX */}
      <div className="create-session-card">
        <h2>Create New Session</h2>
        <p className="text-muted">
          Add the session details to generate an attendance code
        </p>
        <button className="qr-btn" onClick={() => setShowModal(true)}>
          + Add Session
        </button>
      </div>
      {/* SESSION LIST */}
      <h2 style={{ marginTop: "40px", fontWeight: "800" }}>Your Sessions</h2>
      <div className="session-list">
        {sessions.map((s, index) => (
          <div className="session-item" key={index}>
            <div>
              <div className="session-name">{s.name}</div>
              <div className="session-time">
                {s.time} — Room {s.room}
              </div>
              <div className="session-time">Date: {s.date}</div>
            </div>
            <div className="session-code-box">{s.code}</div>
          </div>
        ))}
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Session</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
            <input
              type="time"
              className="modal-input"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Room Number"
              value={sessionRoom}
              onChange={(e) => setSessionRoom(e.target.value)}
            />
            <input
              type="date"
              className="modal-input"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn create"
                onClick={handleCreateSession}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
