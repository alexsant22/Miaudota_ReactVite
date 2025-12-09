const PetModel = require("../models/PetModel");

class PetController {
  static async getAllPets(req, res) {
    try {
      const filters = {
        species: req.query.species,
        status: req.query.status || "disponivel",
        gender: req.query.gender,
        size: req.query.size,
        search: req.query.search,
        limit: req.query.limit,
        offset: req.query.offset,
      };

      const pets = await PetModel.findAll(filters);
      res.json(pets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getPetById(req, res) {
    try {
      const pet = await PetModel.findById(req.params.id);

      if (!pet) {
        return res.status(404).json({
          error: "Pet não encontrado",
        });
      }

      res.json(pet);
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async createPet(req, res) {
    try {
      const petData = req.body;

      // Validação básica
      if (
        !petData.name ||
        !petData.species ||
        !petData.gender ||
        !petData.size
      ) {
        return res.status(400).json({
          error: "Nome, espécie, gênero e porte são obrigatórios",
        });
      }

      const petId = await PetModel.create(petData);
      const pet = await PetModel.findById(petId);

      res.status(201).json({
        message: "Pet cadastrado com sucesso",
        pet,
      });
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async updatePet(req, res) {
    try {
      const petId = req.params.id;
      const petData = req.body;

      // Verificar se pet existe
      const existingPet = await PetModel.findById(petId);
      if (!existingPet) {
        return res.status(404).json({
          error: "Pet não encontrado",
        });
      }

      const updatedPet = await PetModel.update(petId, petData);

      res.json({
        message: "Pet atualizado com sucesso",
        pet: updatedPet,
      });
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async deletePet(req, res) {
    try {
      const petId = req.params.id;

      // Verificar se pet existe
      const existingPet = await PetModel.findById(petId);
      if (!existingPet) {
        return res.status(404).json({
          error: "Pet não encontrado",
        });
      }

      await PetModel.delete(petId);

      res.json({
        message: "Pet removido com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover pet:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getSpecies(req, res) {
    try {
      const speciesCount = await PetModel.getSpeciesCount();
      res.json(speciesCount);
    } catch (error) {
      console.error("Erro ao buscar espécies:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await PetModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = PetController;
