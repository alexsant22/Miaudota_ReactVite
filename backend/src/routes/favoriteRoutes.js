const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/FavoriteController");

// Todas as rotas necessitam de autenticação (será implementado futuramente)
router.get("/user/:userId", FavoriteController.getUserFavorites);
router.get("/ids/:userId", FavoriteController.getFavoriteIds);
router.post("/toggle", FavoriteController.addFavorite);
router.delete("/:userId/:petId", FavoriteController.removeFavorite);
router.get("/check/:userId/:petId", FavoriteController.checkFavorite);

module.exports = router;
