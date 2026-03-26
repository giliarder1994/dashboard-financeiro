require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const porta = process.env.PORT || 3000;

const authRouter = require("./routes/auth.routes");
const categoriasRouter = require("./routes/categorias.routes");
const transacoesRouter = require("./routes/transacoes.routes");
const { erroMiddleware } = require("./middlewares/erro.middleware");

const allowedOrigins = [
  'https://dashboard-financeiro-flame.vercel.app',
  'https://dashboard-financeiro-io086ri3q-giliarder1994s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.use(authRouter);
app.use(categoriasRouter);
app.use(transacoesRouter);

app.use(erroMiddleware);

app.listen(porta, () => { console.log("Servidor rodando na porta " + porta) });
