// Folders: controllers routes views db public
// npm init -y
// npm install express ejs express-validator dotenv pg bcryptjs

const express = require("express");
const app = express();
const router = require("./routes/route");
const path = require("node:path");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
