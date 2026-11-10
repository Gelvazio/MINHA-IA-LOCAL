// server.js - API REST de medições (Express + mysql2/promise)
const express = require('express');
const pool = require('./db'); // pool de conexões MySQL (mysql2/promise)
const { TIPOS_VALIDOS, processarMedicao } = require('./medicaoService');

const app = express();
const PORT = 3000;

// Interpreta o corpo das requisições como JSON
app.use(express.json());

// Colunas retornadas nas consultas
const COLUNAS =
  'id, descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida, classificacao';

// Resposta padrão para erros internos (500)
function erroInterno(res, error) {
  return res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
}

/**
 * Valida o corpo da requisição (POST/PUT).
 * Retorna uma mensagem de erro (string) ou null se estiver válido.
 * Atenção: valor 0 é válido, por isso não usamos checagem "falsy".
 */
function validarCorpo(body) {
  const { descricao, tipo, valor } = body || {};

  if (
    descricao === undefined || descricao === null || String(descricao).trim() === '' ||
    tipo === undefined || tipo === null || String(tipo).trim() === '' ||
    valor === undefined || valor === null || valor === ''
  ) {
    return 'Os campos descricao, tipo e valor são obrigatórios.';
  }

  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    return 'O campo valor deve ser um número finito.';
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return `Tipo inválido. Tipos aceitos: ${TIPOS_VALIDOS.join(', ')}.`;
  }

  return null;
}

// GET / - verifica se a API está operacional
app.get('/', (req, res) => {
  res.status(200).json({ mensagem: 'API de medições operacional' });
});

// GET /medicao - lista todas as medições
app.get('/medicao', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${COLUNAS} FROM medicoes`);
    res.status(200).json(rows);
  } catch (error) {
    erroInterno(res, error);
  }
});

// GET /medicao/alta-velocidade - DEVE vir antes de /medicao/:id,
// senão o Express trataria "alta-velocidade" como um id.
app.get('/medicao/alta-velocidade', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ${COLUNAS} FROM medicoes WHERE classificacao = ?`,
      ['Alta Velocidade']
    );
    res.status(200).json(rows);
  } catch (error) {
    erroInterno(res, error);
  }
});

// GET /medicao/:id - detalhes de uma medição
app.get('/medicao/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${COLUNAS} FROM medicoes WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Medição não encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    erroInterno(res, error);
  }
});

// POST /medicao - cria uma medição
app.post('/medicao', async (req, res) => {
  try {
    const erro = validarCorpo(req.body);
    if (erro) return res.status(400).json({ erro });

    const { descricao, tipo, valor } = req.body;
    const r = processarMedicao(tipo, valor);
    if (!r) {
      return res.status(400).json({ erro: `Tipo inválido. Tipos aceitos: ${TIPOS_VALIDOS.join(', ')}.` });
    }

    const [result] = await pool.execute(
      `INSERT INTO medicoes
         (descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida, classificacao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [descricao, tipo, r.valor_original, r.unidade_original, r.valor_convertido, r.unidade_convertida, r.classificacao]
    );

    res.status(201).json({ id: result.insertId, descricao, tipo, ...r });
  } catch (error) {
    erroInterno(res, error);
  }
});

// PUT /medicao/:id - atualiza e recalcula uma medição
app.put('/medicao/:id', async (req, res) => {
  try {
    const erro = validarCorpo(req.body);
    if (erro) return res.status(400).json({ erro });

    const { descricao, tipo, valor } = req.body;
    const r = processarMedicao(tipo, valor);
    if (!r) {
      return res.status(400).json({ erro: `Tipo inválido. Tipos aceitos: ${TIPOS_VALIDOS.join(', ')}.` });
    }

    // affectedRows (e não changedRows) conta a linha mesmo se os valores forem iguais
    const [result] = await pool.execute(
      `UPDATE medicoes
          SET descricao = ?, tipo = ?, valor_original = ?, unidade_original = ?,
              valor_convertido = ?, unidade_convertida = ?, classificacao = ?
        WHERE id = ?`,
      [descricao, tipo, r.valor_original, r.unidade_original, r.valor_convertido, r.unidade_convertida, r.classificacao, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Medição não encontrada' });
    }

    const [rows] = await pool.query(`SELECT ${COLUNAS} FROM medicoes WHERE id = ?`, [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    erroInterno(res, error);
  }
});

// DELETE /medicao/:id - remove uma medição
app.delete('/medicao/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM medicoes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Medição não encontrada' });
    }
    res.status(200).json({ mensagem: 'Medição removida com sucesso' });
  } catch (error) {
    erroInterno(res, error);
  }
});

// Só inicia o servidor quando executado diretamente (facilita testes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
