exports.erroMiddleware = (erro, req, res, next) => {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno do servidor" });
};