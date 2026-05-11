const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categorias.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/categorias", autenticar, categoriasController.listar);
router.post("/categorias", autenticar, categoriasController.criar);
router.put("/categorias/:id", autenticar, categoriasController.atualizar);
router.delete("/categorias/:id", autenticar, categoriasController.deletar);

module.exports = router;