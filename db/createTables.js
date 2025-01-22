const pool = require("./pool");
const verifyEnvVariablesOk = require("./verifyEnvVariables");
const query = require("./queries");
const bcrypt = require("bcryptjs");

const SQL = `
DROP TABLE IF EXISTS posts CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ),
  lastname VARCHAR ( 255 ),
  username VARCHAR ( 255 ),
  email VARCHAR ( 255 ),
  hash VARCHAR ( 512 ),
  member BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE,
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

async function addTestUsers() {
  const users = await query.getAllUsers();
  if (users.length === 0) {
    console.log("adding test user...");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("123", salt);
    const obiWan = {
      firstname: "Ben",
      lastname: "Kebobi",
      username: "Obi-Wan",
      email: "b.kenobi@jedicouncil.gov",
      hash: hash,
      member: true,
      admin: true,
    };
    const luke = {
      firstname: "Luke",
      lastname: "Skywalker",
      username: "n3wh0pe",
      email: "luke@toschestation.com",
      hash: hash,
      member: true,
      admin: false,
    };
    await query.addNewUser(obiWan);
    await query.addNewUser(luke);
    console.log("...user added");
  }
}

async function addTestPosts() {
  const posts = await query.getAllPosts();
  if (posts.length === 0) {
    console.log("adding test posts...");
    const obiWanId = await query.getUserId("Obi-Wan");
    const lukeId = await query.getUserId("n3wh0pe");
    await query.addNewPost(
      obiWanId,
      "Absolutes",
      "Only a Sith deals in absolutes"
    );
    await query.addNewPost(
      lukeId,
      "Tosche Station",
      "A new batch of power converters has just been delivered!"
    );
    console.log("...test posts added");
  }
}

async function main() {
  console.log("verifying env variables...");
  verifyEnvVariablesOk();
  console.log("building tables...");
  await pool.query(SQL);
  console.log("...tables built");
  await addTestUsers();
  await addTestPosts();
}

(async () => {
  await main();
})();
