const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const { sequelize } = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Connect to Sequelize
sequelize.authenticate()
  .then(() => console.log('Database connected '))
  .catch(err => console.error('Database connection error:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const User = require('./models/User');
User.sync();