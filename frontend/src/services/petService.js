import api from "./api";

export const petService = {
  async getAll(filters = {}) {
    try {
      console.log("🔄 Buscando pets do backend...");
      const response = await api.get("/pets", { params: filters });
      console.log("✅ Pets recebidos:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar pets do backend:", error.message);
      // Fallback para dados mockados se o backend falhar
      return getMockPets(filters);
    }
  },

  async getById(id) {
    try {
      console.log(`🔄 Buscando pet ${id} do backend...`);
      const response = await api.get(`/pets/${id}`);
      console.log("✅ Pet recebido:", response.data.name);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar pet ${id}:`, error.message);
      // Fallback para dados mockados
      return getMockPet(id);
    }
  },

  async getSpecies() {
    try {
      const response = await api.get("/pets/species");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar espécies:", error);
      return [
        { species: "Cachorro", count: 3 },
        { species: "Gato", count: 3 },
      ];
    }
  },

  async getStats() {
    try {
      const response = await api.get("/pets/stats");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      const pets = await this.getAll();
      return {
        total_pets: pets.length,
        available_pets: pets.length,
        dogs: pets.filter((p) => p.species === "Cachorro").length,
        cats: pets.filter((p) => p.species === "Gato").length,
      };
    }
  },

  async create(petData) {
    try {
      const response = await api.post("/pets", petData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      throw error;
    }
  },
};

// Dados mockados de fallback
function getMockPets(filters = {}) {
  console.log("Usando dados mockados de fallback");

  const mockPets = [
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
        "Gatinha dócil e brincalhona. Adora carinho e brincar com bolinhas.",
      image_url:
        "https://images.unsplash.com/photo-1514888286974-6d03bde4ba6d?w=600&h=400&fit=crop",
      location: "São Paulo, SP",
      status: "disponivel",
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
        "Muito amigável e adora crianças. Treinado e muito obediente.",
      image_url:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
      location: "Rio de Janeiro, RJ",
      status: "disponivel",
    },
  ];

  // Aplica filtros básicos
  if (filters.species) {
    return mockPets.filter(
      (pet) => pet.species.toLowerCase() === filters.species.toLowerCase()
    );
  }

  return mockPets;
}

function getMockPet(id) {
  const pets = getMockPets();
  const pet = pets.find((p) => p.id === parseInt(id)) || pets[0];

  return {
    ...pet,
    health_info: "Saudável, vacinado e vermifugado.",
    temperament: pet.species === "Cachorro" ? "Brincalhão" : "Calmo",
    weight: pet.size === "pequeno" ? 3.5 : pet.size === "medio" ? 12.0 : 28.0,
    is_vaccinated: true,
    is_dewormed: true,
    is_castrated: pet.id !== 4, // Rex não é castrado
  };
}
