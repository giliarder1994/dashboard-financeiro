const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conexao = require("../db");

exports.cadastrar = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
        }

        const hash = await bcrypt.hash(senha, 10);

        const [resultado] = await conexao.promise().query(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, hash]
        );

        return res.status(201).json({ id: resultado.insertId, nome, email });

    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ erro: "Email já cadastrado" });
        }
        return next(erro);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }

        const [resultado] = await conexao.promise().query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        const usuario = resultado[0];

        if (!usuario) {
            return res.status(401).json({ erro: "Email ou senha inválidos" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Email ou senha inválidos" });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ token });

    } catch (erro) {
        return next(erro);
    }
};