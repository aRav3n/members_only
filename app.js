// Folders: controllers routes views db public
// npm init -y
// npm install express ejs express-validator dotenv pg bcryptjs

const express = require("express");
const app = express();
const router = require("./routes/route");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
require("./controllers/passportConfig")

app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
