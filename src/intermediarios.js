const bancoDeDados = require('./bancodedados')
const validarSenhaBanco = (req, res, next) => {
    try {
        const senhaOk = bancoDeDados.banco.senha;
        const senhaDigitada = req.query.senha_banco;

        if (!senhaDigitada) {
            return res.status(400).json({ mensagem: `É obrigatório informar a senha!` })
        }
        if (senhaDigitada.localeCompare(senhaOk) !== 0) {
            return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
        }

        next();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const validarSenhaUsuario = (req, res, next) => {
    try {
        const contaEncontrada = req.contaEncontrada;
        const senha = req.params.senha ?? req.body.senha ?? req.query.senha;
        if (contaEncontrada.usuario.senha.localeCompare(senha) !== 0) {
            return res.status(401).json({ mensagem: "A senha do usuario informada é inválida!" })
        }

        next();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const todosCamposCadastro = (req, res, next) => {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: `O preenchimento de todos os campos é Obrigatório` });
        }
        if (nome.trim() === "" || cpf.trim() === "" || data_nascimento.trim() === "" || telefone.trim() === "" || email.trim() === "" || senha.trim() === "") {
            return res.status(400).json({ mensagem: "Os campos nome, sobrenome e curso nao podem esta vazios ou conter somente espaços." })
        }

        next();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const validarEmailECpfUnicos = (req, res, next) => {
    try {
        const numeroConta = Number(req.params.numeroConta);
        const { email, cpf } = req.body;
        if (numeroConta) {
            const emailEncontrado = bancoDeDados.contas.find((conta) => {
                return conta.usuario.email === email;
            })
            const cpfEncontrado = bancoDeDados.contas.find((conta) => {
                return conta.usuario.cpf === cpf;
            })
            if (cpfEncontrado && cpfEncontrado.numero !== numeroConta) {
                return res.status(400).json({ mensagem: `O CPF informado já existe cadastrado em outra conta!` })
            }
            if (emailEncontrado && cpfEncontrado.numero !== numeroConta) {
                return res.status(400).json({ mensagem: `O email informado já existe cadastrado em outra conta!.` })
            }

        } else {
            const emailEncontrado = bancoDeDados.contas.find((conta) => {
                return conta.usuario.email === email;
            })
            const cpfEncontrado = bancoDeDados.contas.find((conta) => {
                return conta.usuario.cpf === cpf;
            })
            if (cpfEncontrado) {
                return res.status(400).json({ mensagem: `O CPF informado já existe cadastrado em outra conta!` })
            }
            if (emailEncontrado) {
                return res.status(400).json({ mensagem: `O email informado já existe cadastrado em outra conta!.` })
            }
        }

        next();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const encontraConta = (req, res, next) => {
    try {
        const contaUnica = req.params.numeroConta ?? req.body.numero_conta ?? req.query.numero_conta;
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

        if (contaUnica) {
            const contaEncontrada = bancoDeDados.contas.find((conta) => {
                return conta.numero === Number(contaUnica);
            })
            if (!contaEncontrada) {
                return res.status(404).json({ mensagem: `Não existe conta para o número informado.` })
            }
            req.contaEncontrada = contaEncontrada;
        } else {
            const contaOrigemEncontrada = bancoDeDados.contas.find((conta) => {
                return conta.numero === Number(numero_conta_origem);
            })
            if (!contaOrigemEncontrada) {
                return res.status(404).json({ mensagem: `Não existe conta para o número de conta origem informado.` })
            }
            req.contaOrigemEncontrada = contaOrigemEncontrada;

            const contaDestinoEncontrada = bancoDeDados.contas.find((conta) => {
                return conta.numero === Number(numero_conta_destino);
            })
            if (!contaDestinoEncontrada) {
                return res.status(404).json({ mensagem: `Não existe conta para o número de conta destino informado.` })
            }
            req.contaDestinoEncontrada = contaDestinoEncontrada;

            if (numero_conta_origem === numero_conta_destino) {
                return res.status(404).json({ mensagem: "O numero de conta de origem tem que ser diferente da conta de destino." })
            }
            if (contaOrigemEncontrada.usuario.senha.localeCompare(senha) !== 0) {
                return res.status(401).json({ mensagem: "A senha do usuario informada é inválida!" })
            }

            if (valor <= 0) {
                return res.status(404).json({ mensagem: `Não é permitido o transacionar valores negativos ou zerados.` });
            }
            if (valor > contaOrigemEncontrada.saldo) {
                return res.status(404).json({ mensagem: `Saldo insuficiente!` });
            }
        }
        next();

    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

const numeroValido = (req, res, next) => {
    try {
        const contaUnica = req.params.numeroConta;
        if (isNaN(Number(contaUnica)) || Number(contaUnica < 1)) {
            return res.status(400)
                .json({ mensagem: 'O ID deve ser um número válido.' });
        }
        next();
    } catch (erro) {
        res.status(500).json({ erro, mensagem: 'Ocorreu um erro interno.' });
    }
}

module.exports = {
    validarSenhaBanco,
    validarEmailECpfUnicos,
    encontraConta,
    validarSenhaUsuario,
    todosCamposCadastro,
    numeroValido,
}