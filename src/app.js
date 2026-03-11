require("dotenv").config();
const express = require("express");
const app = express();
const porta = 3000;

const authRouter = require("./routes/auth.routes");
const categoriasRouter = require("./routes/categorias.routes");

app.use(express.json());

app.use(authRouter);
app.use(categoriasRouter);

app.listen(porta, () => { console.log("Servidor rodando na porta " + porta) });