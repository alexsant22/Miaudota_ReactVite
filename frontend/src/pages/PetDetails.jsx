import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaWeight,
  FaSyringe,
} from "react-icons/fa";
import { petService } from "../services/petService";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    try {
      setLoading(true);
      const data = await petService.getById(id);
      setPet(data);
    } catch (error) {
      console.error("Erro ao carregar pet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você implementaria o envio do formulário
    alert("Formulário enviado! Entraremos em contato em breve.");
    setShowAdoptionForm(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Pet não encontrado
        </h2>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão voltar */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft /> Voltar
      </Link>

      {/* Detalhes do Pet */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Imagem */}
          <div className="md:w-2/5">
            <img
              src={
                pet.image_url ||
                "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=600&fit=crop"
              }
              alt={pet.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Informações */}
          <div className="md:w-3/5 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium">
                    {pet.species}
                  </span>
                  <span className="text-gray-600">
                    {pet.breed || "Sem raça definida"}
                  </span>
                </div>
              </div>
              <button className="text-2xl text-gray-400 hover:text-red-500 transition-colors">
                <FaHeart />
              </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm">Idade</div>
                <div className="text-xl font-semibold">
                  {pet.age} {pet.age_unit}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm">Sexo</div>
                <div className="text-xl font-semibold flex items-center gap-1">
                  <FaVenusMars /> {pet.gender === "M" ? "Macho" : "Fêmea"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm">Porte</div>
                <div className="text-xl font-semibold capitalize">
                  {pet.size}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm">Peso</div>
                <div className="text-xl font-semibold">
                  {pet.weight || "N/A"} kg
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Sobre o {pet.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {pet.description ||
                  "Este pet está procurando um lar amoroso e responsável. Ele merece uma família que o ame e cuide dele para sempre."}
              </p>
            </div>

            {/* Saúde */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Saúde
              </h3>
              <div className="flex flex-wrap gap-3">
                {pet.is_vaccinated && (
                  <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                    <FaSyringe /> Vacinado
                  </span>
                )}
                {pet.is_dewormed && (
                  <span className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                    Vermifugado
                  </span>
                )}
                {pet.is_castrated && (
                  <span className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg">
                    Castrado
                  </span>
                )}
              </div>
            </div>

            {/* Localização */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Localização
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt /> {pet.location || "Localização não informada"}
              </div>
            </div>

            {/* Botão de interesse */}
            <button
              onClick={() => setShowAdoptionForm(true)}
              className="w-full bg-primary-600 text-white py-3.5 rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold mb-6"
            >
              Tenho interesse em adotar
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de Interesse */}
      {showAdoptionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Formulário de Interesse
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">E-mail *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Telefone</label>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-2" />
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Por que você quer adotar o {pet.name}?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Conte um pouco sobre você, sua experiência com pets e por que seria um bom lar..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Enviar interesse
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdoptionForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetDetails;
