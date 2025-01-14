const pool = require("./pool");
require("dotenv").config();

function verifyEnvVariablesOk() {
  let allGood = true;
  let string = "";
  if (!process.env.ROLE_NAME) {
    allGood = false;
    string += "ROLE_NAME missing, ";
  }
  if (!process.env.DATABASE_NAME) {
    allGood = false;
    string += "DATABASE_NAME missing, ";
  }
  if (!process.env.ROLE_PASSWORD) {
    allGood = false;
    string += "ROLE_PASSWORD missing, ";
  }
  if (string.length > 0) {
    string.length = string.length - 2;
  }
  if (!allGood) {
    return console.error(string);
  }
  console.log("...all env variables check out!");
}

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ),
  lastname VARCHAR ( 255 ),
  username VARCHAR ( 255 ),
  email VARCHAR ( 255 ),
  hash VARCHAR ( 512 ),
  member BOOLEAN,
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

main();
