const bancoDeDados = require('../bancodedados');

const listarContas = (req, res) => {
    try {
        return res.status(200).json(bancoDeDados.contas);
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

let contadorDeContas = 0;
const criarConta = (req, res) => {
    let numero = contadorDeContas + 1;
    try {
        const saldo = 0;
        const usuario = { ...req.body }
        const cliente = {
            numero,
            saldo,
            usuario,
        }
        const camposEsperados = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];
        for (const propriedade in usuario) {
            if (camposEsperados.indexOf(propriedade) == -1) {
                return res.status(400).json({ mensagem: `Os campos esperados sao: 'nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'. Existe Campo não esperado.` });
            }
        }
        bancoDeDados.contas.push(cliente);
        contadorDeContas++;
        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const atualizarUsuario = (req, res) => {
    try {
        const contaEncontrada = req.contaEncontrada;
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

        contaEncontrada.usuario.nome = nome;
        contaEncontrada.usuario.cpf = cpf;
        contaEncontrada.usuario.data_nascimento = data_nascimento;
        contaEncontrada.usuario.telefone = telefone;
        contaEncontrada.usuario.email = email;
        contaEncontrada.usuario.senha = senha;

        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const excluirConta = (req, res) => {
    try {
        const contaEncontrada = req.contaEncontrada;
        if (contaEncontrada.saldo > 0) {
            return res.status(404).json({ mensagem: `A conta só pode ser removida se o saldo for zero!` })
        }
        bancoDeDados.contas.splice(bancoDeDados.contas.indexOf(contaEncontrada), 1);
        return res.status(200).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
}