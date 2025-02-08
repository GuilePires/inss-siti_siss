const express = require("express");
const { register, login, listUsers } = require("../controllers/authController");

const router = express.Router();


router.post("/register", register); // Rota para adicionar um utilizador

router.post("/login", login); // Rota para fazer login

// Rota para listar usuários
router.get("/users", listUsers); // Rota para listar usuários


module.exports = router;
