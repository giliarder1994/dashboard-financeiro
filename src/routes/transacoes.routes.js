const express = require("express");
const router = express.Router();
const transacoesController = require("../controllers/transacoes.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/transacoes", autenticar, transacoesController.listar);
router.get("/transacoes/resumo", autenticar, transacoesController.resumo);
router.get("/transacoes/mensal", autenticar, transacoesController.mensal);
router.post("/transacoes", autenticar, transacoesController.criar);
router.put("/transacoes/:id", autenticar, transacoesController.atualizar);
router.delete("/transacoes/:id", autenticar, transacoesController.deletar);

module.exports = router;