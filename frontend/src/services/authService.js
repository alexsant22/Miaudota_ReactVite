import api from "./api";

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.user) {
        // Armazenar usuário no localStorage
        localStorage.setItem(
          "miaudota_user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  // Registro
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("miaudota_user");
  },

  // Buscar perfil
  async getProfile(userId) {
    try {
      const response = await api.get(`/auth/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  },

  // Atualizar perfil
  async updateProfile(userId, userData) {
    try {
      const response = await api.put(`/auth/profile/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },

  // Obter usuário atual
  getCurrentUser() {
    try {
      const user = localStorage.getItem("miaudota_user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      return null;
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!this.getCurrentUser();
  },
};
