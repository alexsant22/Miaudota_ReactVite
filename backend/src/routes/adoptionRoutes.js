const express = require("express");
const router = express.Router();
const AdoptionController = require("../controllers/AdoptionController");

// Rotas públicas
router.post("/interest", AdoptionController.createInterest);

// Rotas de consulta
router.get("/pet/:petId", AdoptionController.getPetInterests);
router.get("/user/:userId", AdoptionController.getUserInterests);
router.get("/interest/:id", AdoptionController.getInterestById);

// Rotas de administração
router.get("/", AdoptionController.getAllInterests);
router.put("/:id/status", AdoptionController.updateInterestStatus);
router.get("/stats", AdoptionController.getStats);

module.exports = router;
