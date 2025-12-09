import { Link } from "react-router-dom";
import { FaHeart, FaDog, FaCat } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoriteContext";

function PetCard({ pet }) {
  const { user, isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      alert("Faça login para favoritar pets!");
      return;
    }

    try {
      await toggleFavorite(pet.id);
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      alert("Erro ao favoritar pet");
    }
  };

  return (
    <Link to={`/pet/${pet.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden pet-card hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={
              pet.image_url ||
              "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop"
            }
            alt={pet.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
          >
            <FaHeart
              className={isFavorite(pet.id) ? "text-red-500" : "text-gray-400"}
            />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              {pet.species === "Cachorro" ? <FaDog /> : <FaCat />}
              {pet.species}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
              <p className="text-gray-600">
                {pet.breed || "Sem raça definida"}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {pet.age} {pet.age_unit}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {pet.description || "Este pet está procurando um lar amoroso!"}
          </p>

          <div className="flex justify-between items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                pet.gender === "M"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              {pet.gender === "M" ? "Macho" : "Fêmea"}
            </span>
            <span className="text-gray-500 capitalize">{pet.size}</span>
          </div>

          <div className="text-center bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Ver detalhes
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PetCard;
