const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    try {
      const [result] = await db.execute(query, [username, email, hashedPassword]);
      return result;
    } catch (error) {
      console.error('DB Error in createUser:', error.message);
      throw error;  
    }
  }

  static async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = ?`;

    try {
      const [rows] = await db.execute(query, [username]);
      return rows[0];
    } catch (error) {
      console.error('DB Error in findByUsername:', error.message);
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;

    try {
      const [rows] = await db.execute(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('DB Error in findByEmail:', error.message);
      throw error;
    }
  }
}

module.exports = User;


