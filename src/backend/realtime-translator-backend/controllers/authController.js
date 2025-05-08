const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Register new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    await User.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Register Error:', err.message);

    // Handle known MySQL error (e.g. duplicate key)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User or email already exists (duplicate key)' });
    }

    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// Login user and get a JWT token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ message: 'Login successful', token });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

module.exports = { registerUser, loginUser };








