import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CLUSTER, JWT_SECRET } =
  process.env;

// Connect to MongoDB
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Error:', err));

// Server test route
app.get('/', (req, res) => res.send('Attendify Server Running'));

// Register new user
app.post('/registerUser', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email is already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Role-based route protection
const authenticateRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Authentication required' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: 'Access forbidden: insufficient rights' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

// Example protected routes
app.get('/student-dashboard', authenticateRole('student'), (req, res) => {
  res.json({ message: `Welcome ${req.user.email} to the student dashboard` });
});

app.get('/teacher-dashboard', authenticateRole('teacher'), (req, res) => {
  res.json({ message: `Welcome ${req.user.email} to the teacher dashboard` });
});

app.get('/admin-dashboard', authenticateRole('admin'), (req, res) => {
  res.json({ message: `Welcome ${req.user.email} to the admin dashboard` });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
