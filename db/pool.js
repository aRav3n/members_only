const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  /*
  host: "localhost",
  user: process.env.ROLE_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.ROLE_PASSWORD,
  port: 5432,
 */
});
