require("dotenv").config();
const conexao = require("./src/db");

const usuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const categorias = `
    CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        tipo ENUM('receita', 'despesa') NOT NULL,
        usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
`;

const transacoes = `
    CREATE TABLE IF NOT EXISTS transacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        tipo ENUM('receita', 'despesa') NOT NULL,
        data DATE NOT NULL,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
`;

conexao.query(usuarios, (erro) => {
    if (erro) { console.log("Erro usuarios:", erro.message); return; }
    console.log("Tabela usuarios criada!");

    conexao.query(categorias, (erro) => {
        if (erro) { console.log("Erro categorias:", erro.message); return; }
        console.log("Tabela categorias criada!");

        conexao.query(transacoes, (erro) => {
            if (erro) { console.log("Erro transacoes:", erro.message); return; }
            console.log("Tabela transacoes criada!");
            process.exit();
        });
    });
});