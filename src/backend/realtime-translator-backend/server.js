// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { validationResult } = require('express-validator');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Global error handler for validation errors
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  next(err);
});

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Realtime Translator Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



