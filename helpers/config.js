const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, './../.env') });
const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE } = process.env;
module.exports = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_DATABASE,
  port: DB_PORT,
  ssl: true,
  max: 10, // max number of clients in pool
  idleTimeoutMillis: 1000,
};
