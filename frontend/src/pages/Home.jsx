import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaDog, FaCat, FaPaw } from "react-icons/fa";
import PetCard from "../components/PetCard";
import { petService } from "../services/petService";

function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPets();
  }, [speciesFilter]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (speciesFilter) filters.species = speciesFilter;
      const data = await petService.getAll(filters);
      setPets(data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed &&
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.description &&
        pet.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Encontre seu novo melhor amigo
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Conectamos animais amorosos com lares amorosos. Adote um pet e mude
          uma vida!
        </p>

        {/* Barra de busca */}
        <div className="max-w-2xl mx-auto relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, raça ou descrição..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          onClick={() => setSpeciesFilter("")}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${
            !speciesFilter
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todos os Pets
        </button>
        <button
          onClick={() => setSpeciesFilter("Cachorro")}
          className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            speciesFilter === "Cachorro"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaDog /> Cachorros
        </button>
        <button
          onClick={() => setSpeciesFilter("Gato")}
          className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            speciesFilter === "Gato"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaCat /> Gatos
        </button>
      </div>

      {/* Contador */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Pets Disponíveis
          <span className="text-gray-500 ml-2">({filteredPets.length})</span>
        </h2>
      </div>

      {/* Lista de Pets */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum pet encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Tente buscar com outros termos."
              : "Não há pets disponíveis no momento."}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSpeciesFilter("");
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/add-pet"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
        >
          <FaPaw /> Cadastrar Pet para Adoção
        </Link>
        <p className="text-gray-600 mt-4">
          Tem um pet para doar? Ajude ele a encontrar um lar!
        </p>
      </div>
    </div>
  );
}

export default Home;
