// db.js
const mysql = require('mysql2');
require('dotenv').config();  // Ensure you're loading environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 'localhost' or your remote host
  user: process.env.DB_USER, // 'root' or your MySQL username
  password: process.env.DB_PASSWORD, // your MySQL password from .env
  database: process.env.DB_NAME, // 'realtime_translator' from .env
});

const db = pool.promise();

module.exports = db;

