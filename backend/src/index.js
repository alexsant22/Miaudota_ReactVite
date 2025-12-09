require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Importar Models
const UserModel = require("./models/UserModel");
const PetModel = require("./models/PetModel");
const FavoriteModel = require("./models/FavoriteModel");
const AdoptionInterestModel = require("./models/AdoptionInterestModel");

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// ROTAS DE AUTENTICAÇÃO
// ==============================

// POST /api/auth/register - Registrar novo usuário
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando",
        required: ["name", "email", "password"],
      });
    }

    // Verificar se email já existe usando o Model
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: "Email já cadastrado",
      });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar usuário usando o Model
    const userId = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Buscar usuário criado
    const user = await UserModel.findById(userId);

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      user,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/auth/login - Login do usuário
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário usando o Model
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // Remover senha da resposta
    delete user.password;

    res.json({
      message: "Login realizado com sucesso",
      user,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/auth/profile/:id - Perfil do usuário
app.get("/api/auth/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Buscar usuário usando o Model
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    // Buscar estatísticas
    const pets = await PetModel.findAll({ created_by: userId });
    const favorites = await FavoriteModel.findByUserId(userId);

    user.pets_registered = pets.length;
    user.favorites_count = favorites.length;

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({
      error: "Erro ao buscar perfil",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// PUT /api/auth/profile/:id - Atualizar perfil
app.put("/api/auth/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Nome é obrigatório",
      });
    }

    // Verificar se usuário existe
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    // Atualizar usuário
    const user = await UserModel.update(userId, { name, phone });

    res.json({
      message: "Perfil atualizado com sucesso",
      user,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ==============================
// ROTAS DE PETS
// ==============================

// GET /api/pets - Listar todos os pets
app.get("/api/pets", async (req, res) => {
  try {
    const filters = {
      species: req.query.species,
      status: req.query.status || "disponivel",
      gender: req.query.gender,
      size: req.query.size,
      search: req.query.search,
    };

    const pets = await PetModel.findAll(filters);
    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/pets/:id - Detalhes de um pet
app.get("/api/pets/:id", async (req, res) => {
  try {
    const pet = await PetModel.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    res.json(pet);
  } catch (error) {
    console.error("Erro ao buscar pet:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/pets - Cadastrar novo pet
app.post("/api/pets", async (req, res) => {
  try {
    const petData = req.body;

    // Validação básica
    if (!petData.name || !petData.species || !petData.gender || !petData.size) {
      return res.status(400).json({
        error: "Nome, espécie, gênero e porte são obrigatórios",
      });
    }

    const petId = await PetModel.create(petData);
    const pet = await PetModel.findById(petId);

    res.status(201).json({
      message: "Pet cadastrado com sucesso",
      pet,
      petId,
    });
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// PUT /api/pets/:id - Atualizar pet
app.put("/api/pets/:id", async (req, res) => {
  try {
    const petId = req.params.id;
    const petData = req.body;

    // Verificar se pet existe
    const existingPet = await PetModel.findById(petId);
    if (!existingPet) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    const updatedPet = await PetModel.update(petId, petData);

    res.json({
      message: "Pet atualizado com sucesso",
      pet: updatedPet,
    });
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// DELETE /api/pets/:id - Remover pet
app.delete("/api/pets/:id", async (req, res) => {
  try {
    const petId = req.params.id;

    // Verificar se pet existe
    const existingPet = await PetModel.findById(petId);
    if (!existingPet) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    await PetModel.delete(petId);

    res.json({
      message: "Pet removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover pet:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/pets/species - Contagem por espécie
app.get("/api/pets/species", async (req, res) => {
  try {
    const speciesCount = await PetModel.getSpeciesCount();
    res.json(speciesCount);
  } catch (error) {
    console.error("Erro ao buscar espécies:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/pets/stats - Estatísticas
app.get("/api/pets/stats", async (req, res) => {
  try {
    const stats = await PetModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ==============================
// ROTAS DE FAVORITOS
// ==============================

// GET /api/favorites/user/:userId - Favoritos do usuário
app.get("/api/favorites/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        error: "ID do usuário é obrigatório",
      });
    }

    const favorites = await FavoriteModel.findByUserId(userId);
    res.json(favorites);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/favorites - Adicionar favorito
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, petId } = req.body;

    if (!userId || !petId) {
      return res.status(400).json({
        error: "ID do usuário e ID do pet são obrigatórios",
      });
    }

    // Verificar se pet existe
    const pet = await PetModel.findById(petId);
    if (!pet) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    // Verificar se já é favorito
    const existingFavorite = await FavoriteModel.find(userId, petId);
    if (existingFavorite) {
      return res.status(400).json({
        error: "Pet já está nos favoritos",
      });
    }

    await FavoriteModel.create(userId, petId);

    res.status(201).json({
      message: "Pet adicionado aos favoritos",
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// DELETE /api/favorites/:userId/:petId - Remover favorito
app.delete("/api/favorites/:userId/:petId", async (req, res) => {
  try {
    const { userId, petId } = req.params;

    if (!userId || !petId) {
      return res.status(400).json({
        error: "ID do usuário e ID do pet são obrigatórios",
      });
    }

    // Verificar se favorito existe
    const existingFavorite = await FavoriteModel.find(userId, petId);
    if (!existingFavorite) {
      return res.status(404).json({
        error: "Favorito não encontrado",
      });
    }

    await FavoriteModel.delete(userId, petId);

    res.json({
      message: "Pet removido dos favoritos",
    });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/favorites/check/:userId/:petId - Verificar se é favorito
app.get("/api/favorites/check/:userId/:petId", async (req, res) => {
  try {
    const { userId, petId } = req.params;

    if (!userId || !petId) {
      return res.status(400).json({
        error: "ID do usuário e ID do pet são obrigatórios",
      });
    }

    const isFavorite = await FavoriteModel.isFavorite(userId, petId);

    res.json({
      isFavorite,
    });
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ==============================
// ROTAS DE INTERESSE EM ADOÇÃO
// ==============================

// POST /api/adoption/interest - Registrar interesse
app.post("/api/adoption/interest", async (req, res) => {
  try {
    const interestData = req.body;

    // Validação básica
    if (
      !interestData.pet_id ||
      !interestData.user_name ||
      !interestData.user_email
    ) {
      return res.status(400).json({
        error: "ID do pet, nome e email são obrigatórios",
      });
    }

    // Verificar se pet existe
    const pet = await PetModel.findById(interestData.pet_id);
    if (!pet) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    // Verificar se pet está disponível
    if (pet.status !== "disponivel") {
      return res.status(400).json({
        error: "Este pet não está disponível para adoção",
      });
    }

    const interestId = await AdoptionInterestModel.create(interestData);

    res.status(201).json({
      message: "Interesse registrado com sucesso",
      interestId,
    });
  } catch (error) {
    console.error("Erro ao registrar interesse:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/adoption/pet/:petId - Interesses por pet
app.get("/api/adoption/pet/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;

    if (!petId) {
      return res.status(400).json({
        error: "ID do pet é obrigatório",
      });
    }

    const interests = await AdoptionInterestModel.findByPetId(petId);
    res.json(interests);
  } catch (error) {
    console.error("Erro ao buscar interesses:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/adoption/user/:userId - Interesses do usuário
app.get("/api/adoption/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        error: "ID do usuário é obrigatório",
      });
    }

    const interests = await AdoptionInterestModel.findByUserId(userId);
    res.json(interests);
  } catch (error) {
    console.error("Erro ao buscar interesses do usuário:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ==============================
// ROTAS DO SISTEMA
// ==============================

// Rota de saúde
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend Miaudota funcionando",
    timestamp: new Date().toISOString(),
    endpoints: [
      "POST /api/auth/register - Registrar usuário",
      "POST /api/auth/login - Login",
      "GET /api/auth/profile/:id - Perfil",
      "GET /api/pets - Listar pets",
      "GET /api/pets/:id - Detalhes do pet",
      "POST /api/pets - Cadastrar pet",
      "GET /api/favorites/user/:userId - Favoritos",
      "POST /api/favorites - Adicionar favorito",
      "POST /api/adoption/interest - Registrar interesse",
    ],
  });
});

// Rota 404 para endpoints não encontrados
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Endpoint não encontrado",
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

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
✅ Servidor backend rodando!
📡 URL: http://localhost:${PORT}
🌐 Também acessível em: http://127.0.0.1:${PORT}
📊 Testes:
  - http://localhost:${PORT}/api/health
  - http://localhost:${PORT}/api/pets
  - http://localhost:${PORT}/api/pets/1
  `);
});

// Tratamento de erros não capturados
process.on("uncaughtException", (err) => {
  console.error("Erro não capturado:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Promise rejeitada não tratada:", err);
});
