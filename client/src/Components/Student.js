import React, { useState } from "react";

import "../App.css";
export default function Student() {
  const [showModal, setShowModal] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [history, setHistory] = useState([
    {
      subject: "Math 101",
      time: "08:00 AM",
      room: "A12",
      date: "2025-01-10",
      status: "Present",
    },
    {
      subject: "Programming",
      time: "10:00 AM",
      room: "B22",
      date: "2025-01-09",
      status: "Absent",
    },
  ]);
  const handleConfirmCode = () => {
    if (sessionCode.trim() === "") return;
    // إضافة مادة جديدة تلقائياً في الـ UI
    setHistory([
      ...history,
      {
        subject: `Session ${sessionCode}`,
        time: "—",
        room: "—",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      },
    ]);
    setSessionCode("");
    setShowModal(false);
  };
  return (
    <div className="dashboard-wrapper">
      {/* الصفحة عنوان */}
      <h1 className="dashboard-title">Student Dashboard</h1>
      {/* ========== الإحصائيات ========== */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Present</p>
          <h2 className="card-value green">
            {history.filter((h) => h.status === "Present").length}
          </h2>
        </div>
        <div className="student-card">
          <p className="card-label">Absent</p>
          <h2 className="card-value red">
            {history.filter((h) => h.status === "Absent").length}
          </h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{history.length}</h2>
        </div>
      </div>
      {/* ========== قسم إدخال الكود ========== */}
      <div className="qr-section">
        <div className="qr-left">
          <h2>Enter Session Code</h2>
          <p>
            Type the session code provided by your teacher to instantly record
            your attendance.
          </p>
          <button className="qr-btn" onClick={() => setShowModal(true)}>
            Enter Code
          </button>
        </div>
      </div>
      {/* ========== جدول التاريخ ========== */}
      <div className="history-section">
        <h2>Attendance History</h2>
        <div className="history-table">
          <div className="history-header">
            <p>Session</p>
            <p>Status</p>
            <p>Date</p>
          </div>
          {history.map((item, i) => (
            <div className="history-row" key={i}>
              <p>{item.subject}</p>
              <p className={item.status === "Present" ? "green" : "red"}>
                {item.status}
              </p>
              <p>{item.date}</p>
            </div>
          ))}
        </div>
      </div>
      {/* ========== نافذة إدخال الكود ========== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="scan-modal">
            <h2>Enter Session Code</h2>
            <input
              type="text"
              className="manual-input"
              placeholder="Enter the code…"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
            />
            <button className="confirm-btn" onClick={handleConfirmCode}>
              Confirm Attendance
            </button>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
