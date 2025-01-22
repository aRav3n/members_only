const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("dotenv").config();

const alphaErr = "must only contain letters";
const nameLengthErr = "must be between 1 and 10 characters";
const emailErr = "must be a valid email";

const validateUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${nameLengthErr}`),
  body("lastname")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${nameLengthErr}`),
  body("username")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage(`User name ${nameLengthErr}`),
  body("email").trim().isEmail().withMessage(`email ${emailErr}`),
  body("password")
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage("Password must be between 6 and 16 characters"),
  body("confirmPassword")
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage("Passwords must match")
    .trim(),
];

const validatePost = [
  body("title")
    .trim()
    .isAlphanumeric()
    .isLength({min: 1})
    .withMessage("You need to have a title"),
  body("body")
    .trim()
    .isAlphanumeric()
];

function formatDate() {
  const date = new Date();

  const formattedDate = date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}

async function deletePost(req, res, next) {
  const postId = req.params.postId;
  db.deletePost(postId);
  res.redirect("/");
}

async function indexGet(req, res) {
  let user = null;
  let firstname = null;
  let username = null;
  if (req.user) {
    user = req.user;
    firstname = user.firstname;
    username = user.username;
  }
  const posts = await db.getAllPosts();
  posts.forEach((post) => {
    const oldTime = post.timestamp;
    post.timestamp = formatDate(oldTime);
  });
  res.render("index", {
    title: "Home",
    user: user,
    firstname: firstname,
    username: username,
    posts: posts,
  });
}

async function loginGet(req, res) {
  let user = null;
  let firstname = null;
  let username = null;
  if (req.user) {
    user = req.user;
    firstname = user.firstname;
    username = user.username;
  }
  res.render("login", {
    title: "Log in",
    user: user,
    firstname: firstname,
    username: username,
  });
}

async function loginPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
}

async function logoutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function newPostGet(req, res, next) {
  let user = null;
  let firstname = null;
  let username = null;
  if (req.user) {
    user = req.user;
    firstname = user.firstname;
    username = user.username;
    res.render("newPost", {
      title: "New Post",
      user: user,
      firstname: firstname,
      username: username,
    });
  } else {
    res.redirect("/");
  }
}

const newPostPost = [
  validatePost,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newPost", {
        title: "New Post",
        user: user,
        firstname: firstname,
        username: username,
        errors: errors,
      });
    }
    const title = req.body.title;
    const body = req.body.body;
    const id = req.user.id;
    db.addNewPost(id, title, body);
    res.redirect("/");
  }
]


async function signUpGet(req, res) {
  let user = null;
  let firstname = null;
  let username = null;
  if (req.user) {
    user = req.user;
    firstname = user.firstname;
    username = user.username;
  }
  res.render("signUpForm", {
    title: "Sign Up",
    user: user,
    firstname: firstname,
    username: username,
  });
}

const signUpPost = [
  validateUser,
  async (req, res) => {
    let user = null;
    let firstname = null;
    let username = null;
    if (req.user) {
      user = req.user;
      firstname = user.firstname;
      username = user.username;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUpForm", {
        title: "Sign Up",
        user: user,
        firstname: firstname,
        username: username,
        errors: errors.array(),
      });
    }
    function hashIfPasswordsMatch(password, confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      if (bcrypt.compareSync(confirmPassword, hash)) {
        return hash;
      }
      return false;
    }

    const adminMemberSalt = bcrypt.genSaltSync(10);
    const memberHash = bcrypt.hashSync(process.env.MEMBER_PW, adminMemberSalt);
    const adminHash = bcrypt.hashSync(process.env.ADMIN_PW, adminMemberSalt);
    const isMember = bcrypt.compareSync(req.body.member, memberHash);
    const isAdmin = isMember
      ? bcrypt.compareSync(req.body.admin, adminHash)
      : isMember;

    const userDetails = {};
    userDetails.firstname = req.body.firstname;
    userDetails.lastname = req.body.lastname;
    userDetails.username = req.body.username;
    userDetails.email = req.body.email;
    userDetails.hash = hashIfPasswordsMatch(
      req.body.password,
      req.body.confirmPassword
    );
    userDetails.member = isMember;
    userDetails.admin = isAdmin;

    db.addNewUser(userDetails);

    res.redirect("/login");
  },
];

module.exports = {
  deletePost,
  indexGet,
  loginGet,
  loginPost,
  logoutPost,
  newPostGet,
  newPostPost,
  signUpGet,
  signUpPost,
};
