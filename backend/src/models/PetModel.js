const { executeQuery } = require("../database/pool");

class PetModel {
  static async findAll(filters = {}) {
    let sql = `
      SELECT p.*, 
             u.name as creator_name,
             u.email as creator_email
      FROM pets p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Aplicar filtros
    if (filters.species) {
      sql += " AND p.species = ?";
      params.push(filters.species);
    }

    if (filters.status) {
      sql += " AND p.status = ?";
      params.push(filters.status);
    }

    if (filters.gender) {
      sql += " AND p.gender = ?";
      params.push(filters.gender);
    }

    if (filters.size) {
      sql += " AND p.size = ?";
      params.push(filters.size);
    }

    if (filters.search) {
      sql += " AND (p.name LIKE ? OR p.breed LIKE ? OR p.description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Ordenação padrão
    sql += " ORDER BY p.created_at DESC";

    // Paginação
    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      sql += " OFFSET ?";
      params.push(parseInt(filters.offset));
    }

    return await executeQuery(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, 
             u.name as creator_name,
             u.email as creator_email,
             u.phone as creator_phone
      FROM pets p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `;
    const pets = await executeQuery(sql, [id]);
    return pets[0];
  }

  static async create(petData) {
    const sql = `
      INSERT INTO pets (
        name, species, breed, age, age_unit, gender, size, weight,
        description, health_info, temperament, location, status,
        is_vaccinated, is_dewormed, is_castrated, 
        image_url, additional_images, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(sql, [
      petData.name,
      petData.species,
      petData.breed || null,
      petData.age,
      petData.age_unit || "meses",
      petData.gender,
      petData.size,
      petData.weight || null,
      petData.description || null,
      petData.health_info || null,
      petData.temperament || null,
      petData.location || null,
      petData.status || "disponivel",
      petData.is_vaccinated || false,
      petData.is_dewormed || false,
      petData.is_castrated || false,
      petData.image_url || null,
      petData.additional_images
        ? JSON.stringify(petData.additional_images)
        : null,
      petData.created_by || null,
    ]);

    return result.insertId;
  }

  static async update(id, petData) {
    const sql = `
      UPDATE pets 
      SET name = ?, species = ?, breed = ?, age = ?, age_unit = ?, 
          gender = ?, size = ?, weight = ?, description = ?, 
          health_info = ?, temperament = ?, location = ?, status = ?,
          is_vaccinated = ?, is_dewormed = ?, is_castrated = ?,
          image_url = ?, additional_images = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(sql, [
      petData.name,
      petData.species,
      petData.breed || null,
      petData.age,
      petData.age_unit || "meses",
      petData.gender,
      petData.size,
      petData.weight || null,
      petData.description || null,
      petData.health_info || null,
      petData.temperament || null,
      petData.location || null,
      petData.status || "disponivel",
      petData.is_vaccinated || false,
      petData.is_dewormed || false,
      petData.is_castrated || false,
      petData.image_url || null,
      petData.additional_images
        ? JSON.stringify(petData.additional_images)
        : null,
      id,
    ]);

    return this.findById(id);
  }

  static async delete(id) {
    const sql = "DELETE FROM pets WHERE id = ?";
    await executeQuery(sql, [id]);
    return true;
  }

  static async getSpeciesCount() {
    const sql = `
      SELECT species, COUNT(*) as count 
      FROM pets 
      WHERE status = 'disponivel' 
      GROUP BY species 
      ORDER BY count DESC
    `;
    return await executeQuery(sql);
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_pets,
        SUM(CASE WHEN status = 'disponivel' THEN 1 ELSE 0 END) as available_pets,
        SUM(CASE WHEN status = 'adotado' THEN 1 ELSE 0 END) as adopted_pets,
        SUM(CASE WHEN species = 'Cachorro' THEN 1 ELSE 0 END) as dogs,
        SUM(CASE WHEN species = 'Gato' THEN 1 ELSE 0 END) as cats
      FROM pets
    `;
    const stats = await executeQuery(sql);
    return stats[0];
  }
}

module.exports = PetModel;
