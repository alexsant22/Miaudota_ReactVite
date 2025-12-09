const { executeQuery } = require("../database/pool");

class FavoriteModel {
  static async findByUserId(userId) {
    const sql = `
      SELECT p.* 
      FROM favorites f
      JOIN pets p ON f.pet_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    return await executeQuery(sql, [userId]);
  }

  static async find(userId, petId) {
    const sql = "SELECT * FROM favorites WHERE user_id = ? AND pet_id = ?";
    const favorites = await executeQuery(sql, [userId, petId]);
    return favorites[0];
  }

  static async create(userId, petId) {
    const sql = "INSERT INTO favorites (user_id, pet_id) VALUES (?, ?)";
    const result = await executeQuery(sql, [userId, petId]);
    return result.insertId;
  }

  static async delete(userId, petId) {
    const sql = "DELETE FROM favorites WHERE user_id = ? AND pet_id = ?";
    await executeQuery(sql, [userId, petId]);
    return true;
  }

  static async isFavorite(userId, petId) {
    const sql = "SELECT 1 FROM favorites WHERE user_id = ? AND pet_id = ?";
    const result = await executeQuery(sql, [userId, petId]);
    return result.length > 0;
  }

  static async getUserFavoriteIds(userId) {
    const sql = "SELECT pet_id FROM favorites WHERE user_id = ?";
    const result = await executeQuery(sql, [userId]);
    return result.map((row) => row.pet_id);
  }

  static async countByPetId(petId) {
    const sql = "SELECT COUNT(*) as count FROM favorites WHERE pet_id = ?";
    const result = await executeQuery(sql, [petId]);
    return result[0].count;
  }
}

module.exports = FavoriteModel;
