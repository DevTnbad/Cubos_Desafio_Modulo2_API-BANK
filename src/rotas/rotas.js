const { Router } = require('express');
const rotas = Router();
const contas = require('../controladores/contas')
const transacoes = require('../controladores/transacoes');
const intermediario = require('../intermediarios');

rotas.get('/contas', intermediario.validarSenhaBanco, contas.listarContas);
rotas.post('/contas', intermediario.todosCamposCadastro, intermediario.validarEmailECpfUnicos, contas.criarConta);
rotas.put('/contas/:numeroConta/usuario', intermediario.numeroValido, intermediario.todosCamposCadastro, intermediario.encontraConta, intermediario.validarEmailECpfUnicos, contas.atualizarUsuario);
rotas.delete('/contas/:numeroConta', intermediario.numeroValido, intermediario.encontraConta, contas.excluirConta);

rotas.post('/transacoes/depositar', intermediario.encontraConta, transacoes.depositar);
rotas.post('/transacoes/sacar', intermediario.encontraConta, intermediario.validarSenhaUsuario, transacoes.sacar);
rotas.post('/transacoes/transferir', intermediario.encontraConta, transacoes.transferir);
rotas.get('/contas/saldo', intermediario.encontraConta, intermediario.validarSenhaUsuario, transacoes.consultarSaldo);
rotas.get('/contas/extrato', intermediario.encontraConta, intermediario.validarSenhaUsuario, transacoes.consultarExtrato);

module.exports = rotas;