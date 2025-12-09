import axios from "axios";

// URL direta para o backend
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para debug
api.interceptors.request.use((config) => {
  console.log(
    "➡️  Enviando requisição:",
    config.method?.toUpperCase(),
    config.url
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("⬅️  Resposta recebida:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Erro na resposta:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
