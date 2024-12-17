const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'electronic_shop',
  port: 5432,
  idleTimeoutMillis: 500,
});

module.exports = pool;
