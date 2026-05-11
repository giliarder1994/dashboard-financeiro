const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.post("/cadastrar", authController.cadastrar);
router.post("/login", authController.login);
router.get("/perfil", autenticar, authController.perfil);
router.put("/perfil", autenticar, authController.atualizarNome);
router.put("/perfil/senha", autenticar, authController.atualizarSenha);

module.exports = router;