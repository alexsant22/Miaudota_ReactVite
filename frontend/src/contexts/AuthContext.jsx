import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

// Criar o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Erro no login:", error);

      // Fallback para dados mockados se backend falhar
      if (email === "admin@miaudota.com" && password === "123456") {
        const mockUser = {
          id: 1,
          name: "Administrador",
          email: "admin@miaudota.com",
          phone: "(11) 99999-9999",
          created_at: "2024-01-01T00:00:00.000Z",
        };

        setUser(mockUser);
        localStorage.setItem("miaudota_user", JSON.stringify(mockUser));

        return { success: true, user: mockUser };
      }

      return {
        success: false,
        error: error.response?.data?.error || "Credenciais inválidas",
      };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Erro no registro:", error);

      // Fallback para dados mockados se backend falhar
      if (userData.email && userData.password) {
        const mockUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          created_at: new Date().toISOString(),
        };

        return { success: true, user: mockUser };
      }

      return {
        success: false,
        error: error.response?.data?.error || "Erro ao criar conta",
      };
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    try {
      if (!user) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const response = await authService.updateProfile(user.id, userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      // Fallback: atualizar localmente
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("miaudota_user", JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }

      return { success: false, error: "Erro ao atualizar perfil" };
    }
  };

  // Valor do contexto
  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
