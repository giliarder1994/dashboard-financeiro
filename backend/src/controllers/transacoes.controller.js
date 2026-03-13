const conexao = require("../db");

exports.listar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const { tipo, pagina = 1, limite = 10 } = req.query;

        const offset = (pagina - 1) * limite;

        let sql = `
            SELECT t.id, t.descricao, t.valor, t.tipo, t.data,
                   c.nome AS categoria
            FROM transacoes t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = ?
        `;

        const params = [usuario_id];

        if (tipo) {
            sql += " AND t.tipo = ?";
            params.push(tipo);
        }

        sql += " ORDER BY t.data DESC LIMIT ? OFFSET ?";
        params.push(Number(limite), Number(offset));

        const [resultado] = await conexao.promise().query(sql, params);
        return res.status(200).json(resultado);

    } catch (erro) {
        return next(erro);
    }
};

exports.criar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const { descricao, valor, tipo, data, categoria_id } = req.body;

        if (!descricao || !valor || !tipo || !data || !categoria_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        if (tipo !== "receita" && tipo !== "despesa") {
            return res.status(400).json({ erro: "Tipo deve ser receita ou despesa" });
        }

        const [resultado] = await conexao.promise().query(
            "INSERT INTO transacoes (descricao, valor, tipo, data, usuario_id, categoria_id) VALUES (?, ?, ?, ?, ?, ?)",
            [descricao, valor, tipo, data, usuario_id, categoria_id]
        );

        return res.status(201).json({ id: resultado.insertId, descricao, valor, tipo, data, categoria_id });

    } catch (erro) {
        return next(erro);
    }
};

exports.atualizar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const { descricao, valor, tipo, data, categoria_id } = req.body;

        const [resultado] = await conexao.promise().query(
            "UPDATE transacoes SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? WHERE id = ? AND usuario_id = ?",
            [descricao, valor, tipo, data, categoria_id, id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Transação não encontrada" });
        }

        return res.status(200).json({ id, descricao, valor, tipo, data, categoria_id });

    } catch (erro) {
        return next(erro);
    }
};

exports.deletar = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);

        const [resultado] = await conexao.promise().query(
            "DELETE FROM transacoes WHERE id = ? AND usuario_id = ?",
            [id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Transação não encontrada" });
        }

        return res.status(204).send();

    } catch (erro) {
        return next(erro);
    }
};

exports.resumo = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;

        const [resultado] = await conexao.promise().query(`
            SELECT 
                SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS total_receitas,
                SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS total_despesas,
                SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) AS saldo
            FROM transacoes
            WHERE usuario_id = ?
        `, [usuario_id]);

        return res.status(200).json(resultado[0]);

    } catch (erro) {
        return next(erro);
    }
};

exports.mensal = async (req, res, next) => {
    try {
        const usuario_id = req.usuario.id;

        const [resultado] = await conexao.promise().query(`
            SELECT 
                DATE_FORMAT(data, '%Y-%m') AS mes,
                SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS receitas,
                SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS despesas
            FROM transacoes
            WHERE usuario_id = ?
            GROUP BY DATE_FORMAT(data, '%Y-%m')
            ORDER BY mes ASC
            LIMIT 6
        `, [usuario_id]);

        return res.status(200).json(resultado);

    } catch (erro) {
        return next(erro);
    }
};