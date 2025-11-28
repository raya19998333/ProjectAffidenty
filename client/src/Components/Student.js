import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAttendance } from '../Features/attendanceSlice'; // تأكدي من المسار الصحيح
import axios from 'axios';
import '../App.css';

export default function Student() {
  const dispatch = useDispatch();

  // بيانات المستخدم من slice
  const user = useSelector((state) => state.users.user);

  // بيانات الحضور من slice
  const attendance = useSelector((state) => state.attendance.history) || [];

  const [showModal, setShowModal] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب الحضور عند تحميل الصفحة
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchAttendance(user.token));
    }
  }, [user, dispatch]);

  const handleConfirmCode = async () => {
    if (!sessionCode.trim()) return;
    if (!user?.token) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        'http://localhost:3001/student/attend',
        { code: sessionCode },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert(res.data.message);

      // تحديث الـ history بعد تسجيل الحضور
      dispatch(fetchAttendance(user.token));
      setSessionCode('');
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error confirming attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Student Dashboard</h1>

      {/* الإحصائيات */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Present</p>
          <h2 className="card-value green">
            {attendance.filter((h) => h.status === 'Present').length}
          </h2>
        </div>
        <div className="student-card">
          <p className="card-label">Absent</p>
          <h2 className="card-value red">
            {attendance.filter((h) => h.status === 'Absent').length}
          </h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{attendance.length}</h2>
        </div>
      </div>

      {/* إدخال كود الحضور */}
      <div className="qr-section">
        <div className="qr-left">
          <h2>Enter Session Code</h2>
          <p>
            Type the session code provided by your teacher to record attendance.
          </p>
          <button className="qr-btn" onClick={() => setShowModal(true)}>
            Enter Code
          </button>
        </div>
      </div>

      {/* جدول الحضور */}
      <div className="history-section">
        <h2>Attendance History</h2>
        <div className="history-table">
          <div className="history-header">
            <p>Session</p>
            <p>Status</p>
            <p>Date</p>
          </div>
          {attendance.map((item, i) => (
            <div className="history-row" key={i}>
              <p>{item.subject}</p>
              <p className={item.status === 'Present' ? 'green' : 'red'}>
                {item.status}
              </p>
              <p>{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة إدخال الكود */}
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
            <button
              className="confirm-btn"
              onClick={handleConfirmCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Attendance'}
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
