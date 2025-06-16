// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const User = require('../models/User');

const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationCode,
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Verify your email - TranslatorApp',
      text: `Welcome to TranslatorApp! Your verification code is: ${verificationCode}`,
    });

    res.status(201).json({ message: 'User registered. Verification code sent to email.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Email
router.post('/verify', async (req, res) => {
  let { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }
  email = email.trim();
  code = code.toString().trim();

  try {
    const user = await User.findOne({ where: { email, verificationCode: code } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📤 New: Get current user info (protected)
router.get('/info', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'username', 'email', 'isVerified']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Fetch user info error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



