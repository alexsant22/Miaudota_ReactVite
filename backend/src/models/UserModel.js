const { executeQuery } = require("../database/pool");

class UserModel {
  static async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const users = await executeQuery(sql, [email]);
    return users[0];
  }

  static async findById(id) {
    const sql =
      "SELECT id, email, name, phone, created_at, updated_at FROM users WHERE id = ?";
    const users = await executeQuery(sql, [id]);
    return users[0];
  }

  static async create(userData) {
    const sql = `
            INSERT INTO users (email, password, name, phone) 
            VALUES (?, ?, ?, ?)
        `;
    const result = await executeQuery(sql, [
      userData.email,
      userData.password,
      userData.name,
      userData.phone,
    ]);
    return result.insertId;
  }

  static async update(id, userData) {
    const sql = `
            UPDATE users 
            SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
    await executeQuery(sql, [userData.name, userData.phone, id]);
    return this.findById(id);
  }

  static async updatePassword(id, hashedPassword) {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    await executeQuery(sql, [hashedPassword, id]);
  }
}

module.exports = UserModel;
