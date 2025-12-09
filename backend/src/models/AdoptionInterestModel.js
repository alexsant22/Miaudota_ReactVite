const { executeQuery } = require("../database/pool");

class AdoptionInterestModel {
  static async create(interestData) {
    const sql = `
      INSERT INTO adoption_interest 
      (pet_id, user_id, user_name, user_email, user_phone, message) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(sql, [
      interestData.pet_id,
      interestData.user_id || null,
      interestData.user_name,
      interestData.user_email,
      interestData.user_phone || null,
      interestData.message || null,
    ]);

    return result.insertId;
  }

  static async findByPetId(petId) {
    const sql = `
      SELECT ai.*, p.name as pet_name 
      FROM adoption_interest ai
      JOIN pets p ON ai.pet_id = p.id
      WHERE ai.pet_id = ?
      ORDER BY ai.created_at DESC
    `;
    return await executeQuery(sql, [petId]);
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT ai.*, p.name as pet_name, p.image_url as pet_image
      FROM adoption_interest ai
      JOIN pets p ON ai.pet_id = p.id
      WHERE ai.user_id = ?
      ORDER BY ai.created_at DESC
    `;
    return await executeQuery(sql, [userId]);
  }

  static async findAll(filters = {}) {
    let sql = `
      SELECT ai.*, p.name as pet_name, u.name as creator_name
      FROM adoption_interest ai
      JOIN pets p ON ai.pet_id = p.id
      LEFT JOIN users u ON ai.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += " AND ai.status = ?";
      params.push(filters.status);
    }

    sql += " ORDER BY ai.created_at DESC";

    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(parseInt(filters.limit));
    }

    return await executeQuery(sql, params);
  }

  static async updateStatus(id, status, notes = null) {
    const sql = `
      UPDATE adoption_interest 
      SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await executeQuery(sql, [status, notes, id]);

    const updated = await this.findById(id);
    return updated;
  }

  static async findById(id) {
    const sql = `
      SELECT ai.*, p.name as pet_name, p.image_url as pet_image
      FROM adoption_interest ai
      JOIN pets p ON ai.pet_id = p.id
      WHERE ai.id = ?
    `;
    const interests = await executeQuery(sql, [id]);
    return interests[0];
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_interests,
        SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'contatado' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'aprovado' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejeitado' THEN 1 ELSE 0 END) as rejected
      FROM adoption_interest
    `;
    const stats = await executeQuery(sql);
    return stats[0];
  }
}

module.exports = AdoptionInterestModel;
