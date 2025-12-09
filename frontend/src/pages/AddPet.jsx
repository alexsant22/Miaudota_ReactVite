import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaw, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

function AddPet() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    species: "Cachorro",
    breed: "",
    age: "",
    age_unit: "meses",
    gender: "M",
    size: "pequeno",
    description: "",
    location: "",
    image_url: "",
    is_vaccinated: false,
    is_dewormed: false,
    is_castrated: false,
  });

  // Redirecionar se não estiver logado
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name || !formData.species || !formData.age) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      // Adicionar created_by
      const petData = {
        ...formData,
        created_by: user.id,
      };

      // Enviar para API
      const response = await fetch("http://localhost:3001/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Pet cadastrado com sucesso!");
        navigate(`/pet/${data.petId}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao cadastrar pet");
      }
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      toast.error("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const speciesOptions = [
    { value: "Cachorro", label: "🐶 Cachorro" },
    { value: "Gato", label: "🐱 Gato" },
    { value: "Outro", label: "🐰 Outro" },
  ];

  const sizeOptions = [
    { value: "pequeno", label: "Pequeno" },
    { value: "medio", label: "Médio" },
    { value: "grande", label: "Grande" },
  ];

  const ageUnitOptions = [
    { value: "meses", label: "Meses" },
    { value: "anos", label: "Anos" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaPaw className="text-primary-600 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-800">
              Cadastrar Novo Pet
            </h1>
          </div>
          <p className="text-gray-600">
            Preencha as informações abaixo para cadastrar um pet para adoção.
          </p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Seção 1: Informações básicas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Informações Básicas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nome do Pet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Luna, Thor..."
                    required
                  />
                </div>

                {/* Espécie */}
                <div>
                  <label className="block text-gray-700 mb-2">Espécie *</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {speciesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Raça */}
                <div>
                  <label className="block text-gray-700 mb-2">Raça</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Labrador, SRD, Persa..."
                  />
                </div>

                {/* Idade */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Idade *</label>
                    <input
                      type="number"
                      name="age"
                      min="0"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: 2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Unidade</label>
                    <select
                      name="age_unit"
                      value={formData.age_unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {ageUnitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-gray-700 mb-2">Sexo *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={formData.gender === "M"}
                        onChange={handleChange}
                        className="mr-2"
                        required
                      />
                      Macho
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={formData.gender === "F"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Fêmea
                    </label>
                  </div>
                </div>

                {/* Porte */}
                <div>
                  <label className="block text-gray-700 mb-2">Porte *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seção 2: Localização */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Localização
              </h2>

              <div>
                <label className="block text-gray-700 mb-2">
                  Cidade/Estado
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            {/* Seção 3: Saúde */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Saúde
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_vaccinated"
                    checked={formData.is_vaccinated}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Vacinado
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_dewormed"
                    checked={formData.is_dewormed}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Vermifugado
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_castrated"
                    checked={formData.is_castrated}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Castrado
                </label>
              </div>
            </div>

            {/* Seção 4: Descrição e Imagem */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Descrição e Imagem
              </h2>

              <div className="space-y-6">
                {/* Descrição */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Descrição do Pet
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Descreva o pet: personalidade, hábitos, histórico..."
                  />
                </div>

                {/* URL da Imagem */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCamera className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Dica: Use imagens do Unsplash como{" "}
                    <a
                      href="https://unsplash.com/s/photos/dog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      https://unsplash.com/s/photos/dog
                    </a>
                  </p>
                </div>

                {/* Preview da Imagem */}
                {formData.image_url && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Preview da Imagem
                    </label>
                    <div className="border rounded-lg p-4">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<p class="text-red-500 text-center py-8">Imagem não encontrada. Verifique a URL.</p>';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <FaSave /> Cadastrar Pet
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </form>

        {/* Aviso */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🐾 Importante</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>
              • Certifique-se de que o pet está realmente disponível para adoção
            </li>
            <li>• Forneça informações verdadeiras e detalhadas</li>
            <li>• Use fotos de boa qualidade que mostrem bem o pet</li>
            <li>• Esteja disponível para responder interessados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddPet;
