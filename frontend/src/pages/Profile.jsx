import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
  FaPaw,
  FaHeart,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [stats, setStats] = useState({
    petsRegistered: 0,
    favoritesCount: 0,
    adoptionRequests: 0,
  });

  // Redirecionar se não estiver logado
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      // Simular carregamento de estatísticas
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Simular API call
      const mockStats = {
        petsRegistered: 3,
        favoritesCount: 5,
        adoptionRequests: 2,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
        setEditMode(false);
      } else {
        toast.error(result.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logout realizado com sucesso!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
            <p className="text-gray-600">
              Gerencie suas informações e atividades
            </p>
          </div>

          <div className="flex gap-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaEdit /> Editar Perfil
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                    });
                  }}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FaTimes /> Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Salvando...
                    </span>
                  ) : (
                    <>
                      <FaSave /> Salvar
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna 1: Informações do usuário */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cartão de perfil */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-primary-600 text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu nome"
                      />
                    ) : (
                      user.name
                    )}
                  </h2>
                  <p className="text-gray-600">
                    Membro desde {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Email</div>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu email"
                      />
                    ) : (
                      <div className="text-gray-800">{user.email}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Telefone</div>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu telefone"
                      />
                    ) : (
                      <div className="text-gray-800">
                        {user.phone || "Não informado"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Membro desde</div>
                    <div className="text-gray-800">
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Minhas Atividades
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <FaPaw className="text-blue-600 text-2xl" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.petsRegistered}
                  </div>
                  <div className="text-gray-600">Pets cadastrados</div>
                </div>

                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <FaHeart className="text-pink-600 text-2xl" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600">
                    {stats.favoritesCount}
                  </div>
                  <div className="text-gray-600">Favoritos</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <FaEnvelope className="text-green-600 text-2xl" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.adoptionRequests}
                  </div>
                  <div className="text-gray-600">Solicitações</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Ações rápidas */}
          <div className="space-y-8">
            {/* Ações rápidas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Ações Rápidas
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/add-pet")}
                  className="w-full text-left p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  🐾 Cadastrar novo pet
                </button>

                <button
                  onClick={() => navigate("/favorites")}
                  className="w-full text-left p-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  ❤️ Ver meus favoritos
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  🔍 Buscar pets para adoção
                </button>
              </div>
            </div>

            {/* Configurações da conta */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Configurações
              </h3>

              <div className="space-y-3">
                <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🔔 Notificações
                </button>

                <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🔒 Privacidade
                </button>

                <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🆘 Ajuda e Suporte
                </button>
              </div>
            </div>

            {/* Sobre */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">Sobre a Miaudota</h3>
              <p className="text-sm opacity-90">
                Conectamos animais amorosos com lares amorosos. Sua conta nos
                ajuda a continuar esse trabalho importante.
              </p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-80">
                  ID da conta: <span className="font-mono">{user.id}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
