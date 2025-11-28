import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessions, createSession } from '../Features/teacherSlice';
import '../App.css';

export default function Teacher({ user }) {
  // ← استخدمي prop user
  const dispatch = useDispatch();
  const { sessions, isLoading } = useSelector((state) => state.teacher);

  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionRoom, setSessionRoom] = useState('');
  const [sessionDate, setSessionDate] = useState('');

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchSessions(user.token));
    }
  }, [dispatch, user?.token]);

  const handleCreateSession = () => {
    if (!sessionName || !sessionTime || !sessionRoom || !sessionDate) return;

    dispatch(
      createSession({
        token: user.token,
        sessionData: {
          name: sessionName,
          time: sessionTime,
          room: sessionRoom,
          date: sessionDate,
        },
      })
    );

    setShowModal(false);
    setSessionName('');
    setSessionTime('');
    setSessionRoom('');
    setSessionDate('');
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
          <h2 className="card-value green">
            {sessions.reduce(
              (acc, session) => acc + (session.students?.length || 0),
              0
            )}
          </h2>
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
      <h2 style={{ marginTop: '40px', fontWeight: '800' }}>Your Sessions</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="session-list">
          {sessions.map((s, index) => (
            <div className="session-item" key={index}>
              <div>
                <div className="session-name">{s.name}</div>
                <div className="session-time">
                  {s.time} — Room {s.room}
                </div>
                <div className="session-time">Date: {s.date}</div>
                <div className="session-students">
                  Students: {s.students?.length || 0}
                </div>
              </div>
              <div className="session-code-box">{s.code}</div>
            </div>
          ))}
        </div>
      )}

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
