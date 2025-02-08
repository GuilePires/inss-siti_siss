const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'siss',
  password: '1234mam@',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch(err => console.error('Erro de conexão com o banco de dados:', err.stack));
  
module.exports = pool;