import api from "./api";

export const favoriteService = {
  async getUserFavorites(userId) {
    try {
      const response = await api.get(`/favorites/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);

      // Fallback para dados locais se a API falhar
      const storedFavorites = localStorage.getItem(
        `miaudota_favorites_${userId}`
      );
      if (storedFavorites) {
        return JSON.parse(storedFavorites);
      }

      return [];
    }
  },

  async addFavorite(userId, petId) {
    try {
      console.log("Adicionando favorito:", { userId, petId });
      const response = await api.post("/favorites", { userId, petId });

      // Atualizar localStorage como fallback
      this.updateLocalStorage(userId, petId, true);

      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      throw error;
    }
  },

  async removeFavorite(userId, petId) {
    try {
      console.log("Removendo favorito:", { userId, petId });
      const response = await api.delete(`/favorites/${userId}/${petId}`);

      // Atualizar localStorage como fallback
      this.updateLocalStorage(userId, petId, false);

      return response.data;
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      throw error;
    }
  },

  async checkFavorite(userId, petId) {
    try {
      const response = await api.get(`/favorites/check/${userId}/${petId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);

      // Fallback para localStorage
      const storedFavorites = localStorage.getItem(
        `miaudota_favorites_${userId}`
      );
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        return { isFavorite: favorites.some((fav) => fav.id === petId) };
      }

      return { isFavorite: false };
    }
  },

  // Helper para gerenciar localStorage como fallback
  updateLocalStorage(userId, petId, isAdding) {
    if (!userId) return;

    const key = `miaudota_favorites_${userId}`;
    let favorites = [];

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        favorites = JSON.parse(stored);
      }

      if (isAdding) {
        if (!favorites.some((fav) => fav.id === petId)) {
          favorites.push({ id: petId, addedAt: new Date().toISOString() });
        }
      } else {
        favorites = favorites.filter((fav) => fav.id !== petId);
      }

      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error("Erro ao atualizar localStorage:", error);
    }
  },

  // Obter IDs dos favoritos do localStorage (para fallback)
  getFavoriteIdsFromLocalStorage(userId) {
    if (!userId) return [];

    try {
      const stored = localStorage.getItem(`miaudota_favorites_${userId}`);
      if (stored) {
        const favorites = JSON.parse(stored);
        return favorites.map((fav) => fav.id);
      }
    } catch (error) {
      console.error("Erro ao ler favoritos do localStorage:", error);
    }

    return [];
  },
};
