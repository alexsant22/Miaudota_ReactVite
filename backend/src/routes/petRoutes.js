const express = require("express");
const router = express.Router();
const PetController = require("../controllers/PetController");

// Rotas públicas
router.get("/", PetController.getAllPets);
router.get("/species", PetController.getSpecies);
router.get("/stats", PetController.getStats);
router.get("/:id", PetController.getPetById);

// Rotas de administração (serão protegidas futuramente)
router.post("/", PetController.createPet);
router.put("/:id", PetController.updatePet);
router.delete("/:id", PetController.deletePet);

module.exports = router;
