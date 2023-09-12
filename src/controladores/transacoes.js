const bancoDeDados = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req, res) => {
    try {
        const { valor, numero_conta } = req.body;
        const contaEncontrada = req.contaEncontrada;

        if (!numero_conta || !valor) {
            return res.status(404).json({ mensagem: `O número da conta e o valor são obrigatórios!` });
        }
        if (valor <= 0) {
            return res.status(404).json({ mensagem: `Não é permitido o deposito de valores negativos ou zerado.` });
        }

        contaEncontrada.saldo += valor;

        const deposito = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"), numero_conta, valor
        }
        bancoDeDados.depositos.push(deposito);

        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const sacar = (req, res) => {
    try {
        const { valor, senha, numero_conta } = req.body;
        const contaEncontrada = req.contaEncontrada;
        if (!numero_conta || !senha || !valor) {
            return res.status(404).json({ mensagem: `É obrigatório informar o numero da conta, valor maior que zero e senha.` });
        }

        if (valor <= 0) {
            return res.status(404).json({ mensagem: `Não é permitido o transacionar valores negativos ou zerados.` });
        }
        if (valor > contaEncontrada.saldo) {
            return res.status(404).json({ mensagem: `Saldo insuficiente!` });
        }

        contaEncontrada.saldo -= valor;

        const saque = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"), numero_conta, valor
        }
        bancoDeDados.saques.push(saque);

        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const transferir = (req, res) => {
    try {
        const { valor, numero_conta_origem, numero_conta_destino, senha } = req.body;
        const contaOrigemEncontrada = req.contaOrigemEncontrada;
        const contaDestinoEncontrada = req.contaDestinoEncontrada;
        if (!numero_conta_origem || !numero_conta_destino || !senha || !valor) {
            return res.status(404).json({ mensagem: `É obrigatório informar o numero da conta de origem, numeroda conta de destino, valor e senha.` });
        }

        contaOrigemEncontrada.saldo -= valor;
        contaDestinoEncontrada.saldo += valor;

        const transferencia = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"), numero_conta_origem, numero_conta_destino, valor
        }
        bancoDeDados.transferencias.push(transferencia);

        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const consultarSaldo = (req, res) => {
    try {
        const { numero_conta, senha } = req.query;
        const contaEncontrada = req.contaEncontrada;
        if (!numero_conta || !senha) {
            return res.status(404).json({ mensagem: `É obrigatório informar o numero da conta e senha.` });
        }
        return res.status(200).json({ saldo: contaEncontrada.saldo })
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const consultarExtrato = (req, res) => {
    try {
        const { numero_conta, senha } = req.query;

        if (!numero_conta || !senha) {
            return res.status(404).json({ mensagem: `É obrigatório informar o numero da conta e senha.` });
        }

        const depositos = bancoDeDados.depositos.filter((deposito) => {
            return deposito.numero_conta === Number(numero_conta);
        })
        const saques = bancoDeDados.saques.filter((saque) => {
            return saque.numero_conta === Number(numero_conta);
        })
        const transferenciasEnviadas = bancoDeDados.transferencias.filter((transferencia) => {
            return transferencia.numero_conta_origem === Number(numero_conta);
        })
        const transferenciasRecebidas = bancoDeDados.transferencias.filter((transferencia) => {
            return transferencia.numero_conta_destino === Number(numero_conta);
        })

        return res.status(200).json({ depositos, saques, transferenciasEnviadas, transferenciasRecebidas });
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

module.exports = {
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    consultarExtrato,
}