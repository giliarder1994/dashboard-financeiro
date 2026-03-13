exports.perfil = async (req, res, next) => {
    try {
        const [resultado] = await conexao.promise().query(
            "SELECT id, nome, email FROM usuarios WHERE id = ?",
            [req.usuario.id]
        );
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
};

exports.atualizarNome = async (req, res, next) => {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });
        await conexao.promise().query(
            "UPDATE usuarios SET nome = ? WHERE id = ?",
            [nome, req.usuario.id]
        );
        return res.status(200).json({ mensagem: "Nome atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
};

exports.atualizarSenha = async (req, res, next) => {
    try {
        const { senhaAtual, novaSenha } = req.body;
        if (!senhaAtual || !novaSenha) return res.status(400).json({ erro: "Preencha todos os campos" });

        const [resultado] = await conexao.promise().query(
            "SELECT senha FROM usuarios WHERE id = ?",
            [req.usuario.id]
        );

        const senhaCorreta = await bcrypt.compare(senhaAtual, resultado[0].senha);
        if (!senhaCorreta) return res.status(401).json({ erro: "Senha atual incorreta" });

        const hash = await bcrypt.hash(novaSenha, 10);
        await conexao.promise().query(
            "UPDATE usuarios SET senha = ? WHERE id = ?",
            [hash, req.usuario.id]
        );

        return res.status(200).json({ mensagem: "Senha atualizada com sucesso" });
    } catch (erro) {
        return next(erro);
    }
};