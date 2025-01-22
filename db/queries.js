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

async function addNewPost(userId, title, body) {
  await verifyThenInsert(
    "INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)",
    [title, body, userId]
  );
}

async function getUserId(username) {
  const rows = await verifyThenSelect(
    "SELECT * FROM users WHERE username LIKE $1",
    [username]
  );
  if (rows.length === 0) {
    return null;
  }
  const user = rows[0];
  const id = user.id;
  return id;
}

async function addNewUser({
  firstname,
  lastname,
  username,
  email,
  hash,
  member,
  admin,
}) {
  if (!getUserId(username)) {
    await verifyThenInsert(
      "INSERT INTO users (firstname, lastname, username, email, hash, member, admin) VALUES ($1, $2, $3, $4, $5)",
      [firstname, lastname, username, email, hash, member, admin]
    );
  }
}

async function findUserById(id) {
  const rows = await verifyThenSelect("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}

async function getAllPosts() {
  const rows = await verifyThenSelect(
    "SELECT * FROM posts JOIN users ON posts.user_id = users.id"
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

async function verifyUser(username, password, done) {
  try {
    const rows = verifyThenSelect("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = rows[0];
    console.log("rows:", rows, "user:", user);
    if (!user) {
      console.log(`${username} does not exist in the database`);
      return done(null, false, { message: "Incorrect username" });
    }

    const isValid = bcrypt.compareSync(password, user.hash);
    if (!isValid) {
      console.log("wrong password");
      return done(null, false, { message: "Incorrect password" });
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}

module.exports = {
  addNewPost,
  addNewUser,
  findUserById,
  getAllPosts,
  getAllUsers,
  getPostDetails,
  getUserId,
  submitNewPost,
  verifyUser,
};
