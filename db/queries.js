const pool = require("./pool");
const verifyEnvVariablesOk = require("./verifyEnvVariables");
const bcrypt = require("bcryptjs");

async function verifyThenInsert(queryString, valuesArray) {
  if (verifyEnvVariablesOk()) {
    await pool.query(queryString, valuesArray);
  }
}

async function verifyThenSelect(queryString, valuesArray) {
  if (verifyEnvVariablesOk()) {
    const { rows } = await pool.query(queryString, valuesArray);
    return rows;
  }
}

async function addNewUser(firstname, lastname, username, email, password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await verifyThenInsert(
    "INSERT INTO users (firstname, lastname, username, email, hash, member) VALUES ($1, $2, $3, $4, $5, TRUE)",
    [firstname, lastname, username, email, hash]
  );
}

async function getAllPosts() {
  const rows = await verifyThenSelect(
    "SELECT title, timestamp, body, user_id FROM posts"
  );
  return rows;
}

async function getAllUsers() {
  const rows = await verifyThenSelect("SELECT * FROM users");
  return rows;
}

async function getPostDetails(id) {
  const rows = await verifyThenSelect(
    "SELECT title, timestamp, body, user_id FROM posts WHERE id = ",
    [id]
  );
  return rows[0];
}

async function submitNewPost(userId, title, body) {
  await verifyThenInsert(
    "INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)",
    [title, body, userId]
  );
}

async function verifyUser(username, password) {
  
}

module.exports = {
  addNewUser,
  getAllPosts,
  getAllUsers,
  getPostDetails,
  submitNewPost,
};
