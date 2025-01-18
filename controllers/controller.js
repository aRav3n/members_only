const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

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

async function indexGet(req, res) {
  let user = null;
  let firstname = null;
  let username = null;
  if (req.user) {
    user = req.user;
    firstname = user.firstname;
    username = user.username;
  }
  res.render("index", {
    title: "Home",
    user: user,
    firstname: firstname,
    username: username,
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
        errors: errors.array(),
        user: user,
        firstname: firstname,
        username: username,
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

    const userDetails = {};
    userDetails.firstname = req.body.firstname;
    userDetails.lastname = req.body.lastname;
    userDetails.username = req.body.username;
    userDetails.email = req.body.email;
    userDetails.hash = hashIfPasswordsMatch(
      req.body.password,
      req.body.confirmPassword
    );

    db.addNewUser(userDetails);

    res.render("signUpForm", {
      title: "Sign Up",
      user: user,
      firstname: firstname,
      username: username,
    });
  },
];

module.exports = {
  indexGet,
  loginGet,
  loginPost,
  logoutPost,
  signUpGet,
  signUpPost,
};
