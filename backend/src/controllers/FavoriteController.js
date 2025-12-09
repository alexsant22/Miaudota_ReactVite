const FavoriteModel = require("../models/FavoriteModel");
const PetModel = require("../models/PetModel");

class FavoriteController {
  static async getUserFavorites(req, res) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          error: "ID do usuário é obrigatório",
        });
      }

      const favorites = await FavoriteModel.findByUserId(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async addFavorite(req, res) {
    try {
      const { userId, petId } = req.body;

      if (!userId || !petId) {
        return res.status(400).json({
          error: "ID do usuário e ID do pet são obrigatórios",
        });
      }

      // Verificar se pet existe
      const pet = await PetModel.findById(petId);
      if (!pet) {
        return res.status(404).json({
          error: "Pet não encontrado",
        });
      }

      // Verificar se já é favorito
      const existingFavorite = await FavoriteModel.find(userId, petId);
      if (existingFavorite) {
        return res.status(400).json({
          error: "Pet já está nos favoritos",
        });
      }

      await FavoriteModel.create(userId, petId);

      res.status(201).json({
        message: "Pet adicionado aos favoritos",
      });
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const { userId, petId } = req.params;

      if (!userId || !petId) {
        return res.status(400).json({
          error: "ID do usuário e ID do pet são obrigatórios",
        });
      }

      // Verificar se favorito existe
      const existingFavorite = await FavoriteModel.find(userId, petId);
      if (!existingFavorite) {
        return res.status(404).json({
          error: "Favorito não encontrado",
        });
      }

      await FavoriteModel.delete(userId, petId);

      res.json({
        message: "Pet removido dos favoritos",
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async checkFavorite(req, res) {
    try {
      const { userId, petId } = req.params;

      if (!userId || !petId) {
        return res.status(400).json({
          error: "ID do usuário e ID do pet são obrigatórios",
        });
      }

      const isFavorite = await FavoriteModel.isFavorite(userId, petId);

      res.json({
        isFavorite,
      });
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getFavoriteIds(req, res) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          error: "ID do usuário é obrigatório",
        });
      }

      const favoriteIds = await FavoriteModel.getUserFavoriteIds(userId);

      res.json(favoriteIds);
    } catch (error) {
      console.error("Erro ao buscar IDs dos favoritos:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = FavoriteController;
