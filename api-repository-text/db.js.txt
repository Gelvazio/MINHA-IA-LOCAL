// db.js - Conexão com o MySQL usando mysql2/promise.
// Um "pool" mantém várias conexões abertas e as reaproveita entre requisições,
// o que é mais eficiente do que abrir uma conexão nova a cada consulta.
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medicoes_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true, // enfileira requisições quando o limite é atingido
  connectionLimit: 10,      // máximo de conexões simultâneas no pool
});

// Exporta o pool diretamente (uso: await pool.query(sql, [params]))
module.exports = pool;
