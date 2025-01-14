const pool = require("./pool");
const verifyEnvVariablesOk = require("./verifyEnvVariables");
const bcrypt = require("bcryptjs");

async function addNewUser(firstname, lastname, username, email, password) {
  const hash = bcrypt.hash(password, 10);
  if (verifyEnvVariablesOk()) {
    await pool.query(
      "INSERT INTO users (firstname, lastname, username, email, hash, member) VALUES ($1, $2, $3, $4, $5, TRUE)",
      [firstname, lastname, username, email, hash]
    );
  }
}

async function getPostDetails(id) {
  const { rows } = await pool.query(
    "SELECT title, timestamp, body, user_id FROM posts WHERE id = ",
    [id]
  );
  return rows[0];
}

async function getAllPosts() {
  const { rows } = await pool.query(
    "SELECT title, timestamp, body, user_id FROM posts"
  );
  return rows;
}

async function submitNewPost(userId, title, body) {
  await pool.query(
    "INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)",
    [title, body, userId]
  );
}

module.exports = {
  addNewUser,
  getAllPosts,
  getPostDetails,
  submitNewPost,
};
