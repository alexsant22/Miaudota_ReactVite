import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaPaw, FaDog, FaCat, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoriteContext";
import PetCard from "../components/PetCard";
import { petService } from "../services/petService";

function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirecionar se não estiver logado
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    loadFavoritePets();
  }, [favorites]);

  const loadFavoritePets = async () => {
    try {
      setLoading(true);

      if (favorites.length === 0) {
        setPets([]);
        return;
      }

      // Para cada favorito, buscar os dados do pet
      const petPromises = favorites.map((id) => petService.getById(id));
      const petsData = await Promise.all(petPromises);

      setPets(petsData);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      toast.error("Erro ao carregar pets favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFavorites = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os favoritos?")) {
      clearFavorites();
      toast.success("Favoritos limpos com sucesso!");
    }
  };

  const handleRemoveFavorite = (petId) => {
    toggleFavorite(petId);
    toast.success("Removido dos favoritos");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaHeart className="text-red-500 text-2xl" />
          <h1 className="text-3xl font-bold text-gray-800">Meus Favoritos</h1>
        </div>

        {favorites.length > 0 ? (
          <p className="text-gray-600">
            Você tem{" "}
            <span className="font-semibold text-primary-600">
              {favorites.length}
            </span>{" "}
            pets favoritos
          </p>
        ) : (
          <p className="text-gray-600">
            Você ainda não tem pets favoritos. Explore os pets disponíveis!
          </p>
        )}
      </div>

      {/* Botões de ação */}
      {favorites.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleClearFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <FaTrash /> Limpar todos
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaPaw /> Ver mais pets
          </Link>
        </div>
      )}

      {/* Lista de Favoritos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FaHeart className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum pet favoritado
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Você ainda não adicionou nenhum pet aos favoritos. Explore os pets
            disponíveis para adoção e clique no ❤️ para favoritar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaDog /> Ver Cachorros
            </Link>
            <Link
              to="/?species=Gato"
              className="inline-flex items-center gap-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <FaCat /> Ver Gatos
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-primary-600">
                {pets.length}
              </div>
              <div className="text-gray-600">Total de favoritos</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-green-600">
                {pets.filter((p) => p.status === "disponivel").length}
              </div>
              <div className="text-gray-600">Disponíveis para adoção</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-blue-600">
                {pets.filter((p) => p.species === "Cachorro").length}
              </div>
              <div className="text-gray-600">Cachorros</div>
            </div>
          </div>

          {/* Grid de Pets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="relative">
                <PetCard pet={pet} />
                <button
                  onClick={() => handleRemoveFavorite(pet.id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Remover dos favoritos"
                >
                  <FaHeart className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dicas */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          💡 Dicas para adoção responsável
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">
              Prepare seu lar
            </h4>
            <p className="text-gray-600 text-sm">
              Tenha espaço adequado, comida, água e brinquedos antes de levar o
              pet para casa.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">
              Considere o tempo
            </h4>
            <p className="text-gray-600 text-sm">
              Pets precisam de atenção diária. Certifique-se de ter tempo para
              cuidar do seu novo amigo.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 mb-2">Custos</h4>
            <p className="text-gray-600 text-sm">
              Considere gastos com veterinário, alimentação, vacinas e outros
              cuidados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorites;
