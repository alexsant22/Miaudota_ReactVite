require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS - APENAS UMA VEZ
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

// Rota GET /api/pets - BUSCA DO BANCO DE DADOS
app.get("/api/pets", async (req, res) => {
  try {
    console.log("Rota /api/pets acessada com query:", req.query);

    // Aqui você conectaria ao banco de dados
    // Por enquanto, retornamos dados mockados
    const pets = [
      {
        id: 1,
        name: "Luna",
        species: "Gato",
        breed: "Siamês",
        age: 2,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        description: "Gatinha dócil e brincalhona",
        image_url:
          "https://images.unsplash.com/photo-1514888286974-6d03bde4ba6d?w=600&h=400&fit=crop",
        location: "São Paulo, SP",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        created_at: "2024-01-15T10:30:00.000Z",
      },
      {
        id: 2,
        name: "Thor",
        species: "Cachorro",
        breed: "Labrador",
        age: 3,
        age_unit: "anos",
        gender: "M",
        size: "grande",
        description: "Muito amigável e adora crianças",
        image_url:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
        location: "Rio de Janeiro, RJ",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        created_at: "2024-01-10T14:20:00.000Z",
      },
      {
        id: 3,
        name: "Mimi",
        species: "Gato",
        breed: "Persa",
        age: 4,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        description: "Calma e carinhosa",
        image_url:
          "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=400&fit=crop",
        location: "Belo Horizonte, MG",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        created_at: "2024-01-05T09:15:00.000Z",
      },
    ];

    // Aplicar filtros se fornecidos
    let filteredPets = [...pets];

    if (req.query.species) {
      filteredPets = filteredPets.filter(
        (pet) => pet.species.toLowerCase() === req.query.species.toLowerCase()
      );
    }

    if (req.query.status) {
      filteredPets = filteredPets.filter(
        (pet) => pet.status === req.query.status
      );
    }

    if (req.query.gender) {
      filteredPets = filteredPets.filter(
        (pet) => pet.gender === req.query.gender
      );
    }

    if (req.query.size) {
      filteredPets = filteredPets.filter((pet) => pet.size === req.query.size);
    }

    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredPets = filteredPets.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm) ||
          (pet.breed && pet.breed.toLowerCase().includes(searchTerm)) ||
          pet.description.toLowerCase().includes(searchTerm)
      );
    }

    res.json(filteredPets);
  } catch (error) {
    console.error("Erro em /api/pets:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Rota GET /api/pets/:id
app.get("/api/pets/:id", async (req, res) => {
  try {
    console.log(`Buscando pet ID: ${req.params.id}`);

    const pets = [
      {
        id: 1,
        name: "Luna",
        species: "Gato",
        breed: "Siamês",
        age: 2,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        description:
          "Gatinha dócil e brincalhona. Adora carinho e está acostumada com crianças. É castrada e vacinada.",
        health_info: "Vacinada, vermifugada e castrada. Saudável.",
        temperament: "Dócil, brincalhona",
        location: "São Paulo, SP",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1514888286974-6d03bde4ba6d?w=800&h=600&fit=crop",
        weight: 3.5,
        additional_images: [],
        created_at: "2024-01-15T10:30:00.000Z",
      },
      {
        id: 2,
        name: "Thor",
        species: "Cachorro",
        breed: "Labrador",
        age: 3,
        age_unit: "anos",
        gender: "M",
        size: "grande",
        description:
          "Muito amigável e adora crianças. Treinado para fazer necessidades no lugar certo.",
        health_info: "Vacinado, vermifugado e castrado. Peso saudável.",
        temperament: "Amigável, brincalhão",
        location: "Rio de Janeiro, RJ",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop",
        weight: 28.0,
        additional_images: [],
        created_at: "2024-01-10T14:20:00.000Z",
      },
    ];

    const pet = pets.find((p) => p.id === parseInt(req.params.id));

    if (!pet) {
      return res.status(404).json({
        error: "Pet não encontrado",
        message: `Pet com ID ${req.params.id} não existe`,
      });
    }

    res.json(pet);
  } catch (error) {
    console.error(`Erro ao buscar pet ${req.params.id}:`, error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Rota POST /api/pets - CADASTRAR NOVO PET
app.post("/api/pets", async (req, res) => {
  try {
    console.log("Recebendo novo pet:", req.body);

    // Validação básica
    const requiredFields = ["name", "species", "gender", "size"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando",
        missingFields: missingFields,
      });
    }

    // Simular criação no banco
    const newPet = {
      id: Date.now(), // ID temporário
      ...req.body,
      status: req.body.status || "disponivel",
      age_unit: req.body.age_unit || "meses",
      is_vaccinated: req.body.is_vaccinated || false,
      is_dewormed: req.body.is_dewormed || false,
      is_castrated: req.body.is_castrated || false,
      created_at: new Date().toISOString(),
    };

    res.status(201).json({
      message: "Pet cadastrado com sucesso",
      pet: newPet,
      petId: newPet.id,
    });
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Rota GET /api/pets/species
app.get("/api/pets/species", (req, res) => {
  try {
    const species = [
      { species: "Cachorro", count: 1 },
      { species: "Gato", count: 2 },
    ];
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar espécies" });
  }
});

// Rota GET /api/pets/stats
app.get("/api/pets/stats", (req, res) => {
  try {
    const stats = {
      total_pets: 3,
      available_pets: 3,
      adopted_pets: 0,
      dogs: 1,
      cats: 2,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

// Rota de saúde
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend Miaudota funcionando",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET /api/pets - Listar pets",
      "GET /api/pets/:id - Detalhes do pet",
      "POST /api/pets - Cadastrar pet",
      "GET /api/pets/species - Contagem por espécie",
      "GET /api/pets/stats - Estatísticas",
      "GET /api/health - Saúde da API",
    ],
  });
});

// Rota 404 para endpoints não encontrados
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Endpoint não encontrado",
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "/api/pets",
      "/api/pets/:id",
      "/api/pets/species",
      "/api/pets/stats",
      "/api/health",
    ],
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
