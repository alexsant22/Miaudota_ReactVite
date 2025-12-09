const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Rotas públicas
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Rotas de perfil (serão protegidas com autenticação futuramente)
router.get("/profile/:userId", AuthController.getProfile);
router.put("/profile/:userId", AuthController.updateProfile);

module.exports = router;
