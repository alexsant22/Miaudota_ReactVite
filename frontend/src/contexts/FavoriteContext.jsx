import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { favoriteService } from "../services/favoriteService";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const FavoriteContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error(
      "useFavorites deve ser usado dentro de um FavoriteProvider"
    );
  }
  return context;
};

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Carregar favoritos do backend quando o usuário mudar
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await favoriteService.getUserFavorites(user.id);
      setFavorites(data);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      toast.error("Erro ao carregar favoritos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = async (petId) => {
    if (!user) {
      toast.error("Faça login para favoritar pets");
      return false;
    }

    try {
      const isCurrentlyFavorite = favorites.some((fav) => fav.id === petId);

      if (isCurrentlyFavorite) {
        await favoriteService.removeFavorite(user.id, petId);
        setFavorites(favorites.filter((fav) => fav.id !== petId));
        toast.success("Removido dos favoritos");
      } else {
        await favoriteService.addFavorite(user.id, petId);
        // Recarregar a lista completa
        await loadFavorites();
        toast.success("Adicionado aos favoritos");
      }

      return !isCurrentlyFavorite;
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);

      // Mensagem de erro mais específica
      if (error.response?.status === 404) {
        toast.error("Pet não encontrado");
      } else if (error.response?.status === 400) {
        toast.error("Pet já está nos favoritos");
      } else {
        toast.error("Erro ao atualizar favoritos");
      }

      return false;
    }
  };

  const isFavorite = (petId) => {
    return favorites.some((fav) => fav.id === petId);
  };

  const clearFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Para cada favorito, remover do backend
      for (const favorite of favorites) {
        await favoriteService.removeFavorite(user.id, favorite.id);
      }
      setFavorites([]);
      toast.success("Todos os favoritos foram removidos");
    } catch (error) {
      console.error("Erro ao limpar favoritos:", error);
      toast.error("Erro ao limpar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    favorites,
    loading,
    loadFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    hasFavorites: favorites.length > 0,
    favoritesCount: favorites.length,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};
