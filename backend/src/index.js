require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testConnection } = require("./database/pool");
const { createDatabase } = require("./database/init");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/adoption", adoptionRoutes);

// Rota de saúde
app.get("/api/health", async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected",
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Rota para informações do sistema
app.get("/api/info", (req, res) => {
  res.json({
    app: "Miaudota Backend",
    version: "1.0.0",
    description: "Plataforma de Adoção de Pets",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile/:userId",
      },
      pets: {
        list: "GET /api/pets",
        details: "GET /api/pets/:id",
        create: "POST /api/pets",
        stats: "GET /api/pets/stats",
      },
      favorites: {
        list: "GET /api/favorites/user/:userId",
        add: "POST /api/favorites/toggle",
        remove: "DELETE /api/favorites/:userId/:petId",
      },
      adoption: {
        interest: "POST /api/adoption/interest",
        listByPet: "GET /api/adoption/pet/:petId",
      },
    },
  });
});

// Middleware para rotas não encontradas
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error("Erro global:", error);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Função para inicializar banco de dados com retry
async function initializeDatabaseWithRetry(maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(
        `🔄 Tentativa ${
          i + 1
        } de ${maxRetries}: Inicializando banco de dados...`
      );
      await createDatabase();
      console.log("✅ Banco de dados inicializado com sucesso!");
      return true;
    } catch (error) {
      console.error(`❌ Tentativa ${i + 1} falhou:`, error.message);

      if (i < maxRetries - 1) {
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error(
    "❌ Todas as tentativas falharam. O banco de dados pode não estar acessível."
  );
  return false;
}

// Inicializar servidor
async function startServer() {
  try {
    console.log("🚀 Iniciando servidor Miaudota...");

    // Primeiro, inicializar o banco de dados
    const dbInitialized = await initializeDatabaseWithRetry();

    if (!dbInitialized) {
      console.log("⚠️  Continuando sem banco de dados inicializado...");
      console.log("💡 Você pode tentar inicializar manualmente com:");
      console.log("   npm run init-db");
    }

    // Testar conexão após inicialização
    const dbConnected = await testConnection();

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`
🎉 Servidor Miaudota iniciado com sucesso!
📡 Porta: ${PORT}
📊 Ambiente: ${process.env.NODE_ENV}
🔗 Banco de dados: ${dbConnected ? "✅ Conectado" : "❌ Desconectado"}
🌐 URL: http://localhost:${PORT}

📋 Endpoints principais:
   🔐 Autenticação:
      POST /api/auth/register    - Registrar usuário
      POST /api/auth/login       - Login
   
   🐾 Pets:
      GET  /api/pets             - Listar todos os pets
      GET  /api/pets/:id         - Detalhes do pet
      POST /api/pets             - Cadastrar novo pet
   
   ⭐ Favoritos:
      GET  /api/favorites/user/:userId - Listar favoritos
      POST /api/favorites/toggle      - Adicionar/remover favorito
   
   💌 Adoção:
      POST /api/adoption/interest     - Registrar interesse
      GET  /api/adoption/pet/:petId   - Interesses por pet

📝 Teste rápido:
   curl http://localhost:${PORT}/api/pets
   curl http://localhost:${PORT}/api/info
            `);
    });
  } catch (error) {
    console.error("❌ Falha crítica ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

module.exports = app;
