import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import User from './models/User.js';
import Session from './models/Session.js';
import Attendance from './models/Attendance.js';
import SystemNote from './models/SystemNote.js';

dotenv.config();

const { PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CLUSTER, JWT_SECRET } =
  process.env;

// =======================
// MULTER SETUP
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// =======================
// EXPRESS SETUP
// =======================
const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MONGODB CONNECTION
// =======================
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Error:', err));

// =======================
// AUTH MIDDLEWARE
// =======================
const authenticateRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Authentication required' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== requiredRole)
        return res
          .status(403)
          .json({ message: 'Forbidden: insufficient rights' });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

// =======================
// ROUTES
// =======================

// Test route
app.get('/', (req, res) => res.send('Attendify Server Running'));

// ===== REGISTER USER =====
app.post('/registerUser', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: role || 'student',
    });

    res.status(201).json({ message: 'User registered', newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGIN =====
// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===== TEACHER: Create Session =====
app.post(
  '/teacher/create-session',
  authenticateRole('teacher'),
  async (req, res) => {
    try {
      const { name, time, room, date } = req.body;
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();

      const session = await Session.create({
        name,
        time,
        room,
        date,
        code,
        teacherId: req.user.id,
      });

      res.status(201).json({ message: 'Session created', session });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===== TEACHER: Get Sessions =====
app.get('/teacher/sessions', authenticateRole('teacher'), async (req, res) => {
  try {
    const sessions = await Session.find({ teacherId: req.user.id });
    res.json({ count: sessions.length, sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== STUDENT: Confirm Attendance =====
app.post('/student/attend', authenticateRole('student'), async (req, res) => {
  try {
    const { code } = req.body;
    const session = await Session.findOne({ code });
    if (!session)
      return res.status(404).json({ message: 'Invalid session code' });

    const existing = await Attendance.findOne({
      studentId: req.user.id,
      sessionId: session._id,
    });
    if (existing)
      return res.status(400).json({ message: 'Attendance already recorded' });

    const attendance = await Attendance.create({
      studentId: req.user.id,
      sessionId: session._id,
      date: new Date().toISOString().split('T')[0],
    });

    if (!session.students.includes(req.user.id)) {
      session.students.push(req.user.id);
      await session.save();
    }

    res.json({ message: 'Attendance confirmed', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== STUDENT: Attendance History =====
app.get('/student/history', authenticateRole('student'), async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id }).populate(
      'sessionId'
    );
    const history = records.map((r) => ({
      subject: r.sessionId.name,
      time: r.sessionId.time,
      room: r.sessionId.room,
      date: r.date,
      status: r.status,
    }));
    res.json({ count: history.length, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ADMIN: Stats =====
app.get('/admin/stats', authenticateRole('admin'), async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'student' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const sessions = await Session.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = await Attendance.countDocuments({ date: today });
    res.json({ students, teachers, sessions, attendanceToday });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ADMIN: Recent Sessions =====
app.get(
  '/admin/recent-sessions',
  authenticateRole('admin'),
  async (req, res) => {
    try {
      const sessions = await Session.find()
        .sort({ date: -1 })
        .limit(5)
        .populate('teacherId', 'name');
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===== ADMIN: New Users =====
app.get('/admin/new-users', authenticateRole('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
