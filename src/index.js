const express = require('express');
const app = express();
const rotas = require('./rotas/rotas');

app.use(express.json());
app.use(rotas);

const porta = 3000;
app.listen(porta, () => console.log(`Servidor Bando_Digital Up na porta: ${porta}`));