const { Client } = require("pg");
require("dotenv").config();
const tableName = "messages";
const dbName = "mini_message_board";

const SQL = `
CREATE TABLE IF NOT EXISTS tableName (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text VARCHAR ( 255 ),
  being VARCHAR ( 255 ),
  added TIMESTAMP DEFAULT NOW()
);

INSERT INTO tableName (text, being)
VALUES
  ('May the Force be with you.', 'Luke Skywalker'),
  ('Never tell me the odds.', 'Han Solo'),
  ('Help me, Obi-Wan Kenobi. You''re my only hope.', 'Princess Leia'),
  ('I am your father.', 'Darth Vader'),
  ('Use the Force, Luke.', 'Obi-Wan Kenobi');
`;

async function main() {
  console.log("seeding...");
  const roleName = process.env.ROLE_NAME;
  const rolePassword = process.env.ROLE_PASSWORD;
  const client = new Client({
    connectionString: `postgresql://roleName:rolePassword@localhost:5432/dbName`,
    // connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
