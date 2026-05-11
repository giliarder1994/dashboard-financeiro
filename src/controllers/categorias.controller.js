const conexao = require("../db");

exports.listar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;

        const [resultado] = await conexao.promise().query(
            "SELECT * FROM categorias WHERE usuario_id = ?",
            [usuario_id]
        );

        return res.status(200).json(resultado);

    } catch (erro) {
        return next(erro);
    }
};

exports.criar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const { nome, tipo } = req.body;

        if (!nome || !tipo) {
            return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
        }

        if (tipo !== "receita" && tipo !== "despesa") {
            return res.status(400).json({ erro: "Tipo deve ser receita ou despesa" });
        }

        const [resultado] = await conexao.promise().query(
            "INSERT INTO categorias (nome, tipo, usuario_id) VALUES (?, ?, ?)",
            [nome, tipo, usuario_id]
        );

        return res.status(201).json({ id: resultado.insertId, nome, tipo });

    } catch (erro) {
        return next(erro);
    }
};

exports.atualizar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const { nome, tipo } = req.body;

        const [resultado] = await conexao.promise().query(
            "UPDATE categorias SET nome = ?, tipo = ? WHERE id = ? AND usuario_id = ?",
            [nome, tipo, id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }

        return res.status(200).json({ id, nome, tipo });

    } catch (erro) {
        return next(erro);
    }
};

exports.deletar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);

        const [resultado] = await conexao.promise().query(
            "DELETE FROM categorias WHERE id = ? AND usuario_id = ?",
            [id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }

        return res.status(204).send();

    } catch (erro) {
        return next(erro);
    }
};