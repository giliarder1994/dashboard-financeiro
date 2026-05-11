require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

// Testa a conexão na inicialização
pool.getConnection((erro, conexao) => {
    if (erro) {
        console.error("Erro ao conectar ao banco de dados:", erro.message);
        return;
    }
    console.log("Conectado ao MySQL (FreeSQLDatabase) com sucesso!");
    conexao.release();
});

module.exports = pool;