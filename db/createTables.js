const pool = require("./pool");
const verifyEnvVariablesOk = require("./verifyEnvVariables");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ),
  lastname VARCHAR ( 255 ),
  username VARCHAR ( 255 ),
  email VARCHAR ( 255 ),
  hash VARCHAR ( 512 ),
  member BOOLEAN DEFAULT TRUE,
  added TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  timestamp TIMESTAMP DEFAULT NOW(),
  body VARCHAR ( 512 ),
  user_id INTEGER REFERENCES users(id)
);
`;

async function main() {
  console.log("verifying env variables...");
  verifyEnvVariablesOk();
  console.log("building tables...");
  await pool.query(SQL);
  console.log("...tables built");
}

(async () => {
  await main();
})();
