const AdoptionInterestModel = require("../models/AdoptionInterestModel");
const PetModel = require("../models/PetModel");

class AdoptionController {
  static async createInterest(req, res) {
    try {
      const interestData = req.body;

      // Validação básica
      if (
        !interestData.pet_id ||
        !interestData.user_name ||
        !interestData.user_email
      ) {
        return res.status(400).json({
          error: "ID do pet, nome e email são obrigatórios",
        });
      }

      // Verificar se pet existe
      const pet = await PetModel.findById(interestData.pet_id);
      if (!pet) {
        return res.status(404).json({
          error: "Pet não encontrado",
        });
      }

      // Verificar se pet está disponível
      if (pet.status !== "disponivel") {
        return res.status(400).json({
          error: "Este pet não está disponível para adoção",
        });
      }

      const interestId = await AdoptionInterestModel.create(interestData);

      res.status(201).json({
        message: "Interesse registrado com sucesso",
        interestId,
      });
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getPetInterests(req, res) {
    try {
      const petId = req.params.petId;

      if (!petId) {
        return res.status(400).json({
          error: "ID do pet é obrigatório",
        });
      }

      const interests = await AdoptionInterestModel.findByPetId(petId);
      res.json(interests);
    } catch (error) {
      console.error("Erro ao buscar interesses:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getUserInterests(req, res) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          error: "ID do usuário é obrigatório",
        });
      }

      const interests = await AdoptionInterestModel.findByUserId(userId);
      res.json(interests);
    } catch (error) {
      console.error("Erro ao buscar interesses do usuário:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getAllInterests(req, res) {
    try {
      const filters = {
        status: req.query.status,
        limit: req.query.limit,
      };

      const interests = await AdoptionInterestModel.findAll(filters);
      res.json(interests);
    } catch (error) {
      console.error("Erro ao buscar todos os interesses:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async updateInterestStatus(req, res) {
    try {
      const interestId = req.params.id;
      const { status, notes } = req.body;

      if (!interestId || !status) {
        return res.status(400).json({
          error: "ID do interesse e status são obrigatórios",
        });
      }

      // Verificar se interesse existe
      const existingInterest = await AdoptionInterestModel.findById(interestId);
      if (!existingInterest) {
        return res.status(404).json({
          error: "Interesse não encontrado",
        });
      }

      // Atualizar status do pet se aprovado
      if (status === "aprovado" && existingInterest.pet_id) {
        await PetModel.update(existingInterest.pet_id, { status: "processo" });
      }

      const updatedInterest = await AdoptionInterestModel.updateStatus(
        interestId,
        status,
        notes
      );

      res.json({
        message: "Status atualizado com sucesso",
        interest: updatedInterest,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getInterestById(req, res) {
    try {
      const interestId = req.params.id;

      if (!interestId) {
        return res.status(400).json({
          error: "ID do interesse é obrigatório",
        });
      }

      const interest = await AdoptionInterestModel.findById(interestId);

      if (!interest) {
        return res.status(404).json({
          error: "Interesse não encontrado",
        });
      }

      res.json(interest);
    } catch (error) {
      console.error("Erro ao buscar interesse:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await AdoptionInterestModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = AdoptionController;
