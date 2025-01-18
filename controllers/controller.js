const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const alphaErr = "must only contain letters";
const nameLengthErr = "must be between 1 and 10 characters";
const ageNumericErr = "must be a number";
const ageValueErr = "must be between 18 and 120";
const emailErr = "must be a valid email";
const bioLengthErr = "must be less than 200 characters";

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

async function signUpGet(req, res) {
  res.render("signUpForm", {
    title: "Sign Up",
  });
}

const signUpPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUpForm", {
        title: "Sign Up",
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

    const userDetails = {};
    userDetails.firstname = req.body.firstname;
    userDetails.lastname = req.body.lastname;
    userDetails.username = req.body.username;
    userDetails.email = req.body.email;
    userDetails.hash = hashIfPasswordsMatch(
      req.body.password,
      req.body.confirmPassword
    );

    console.log(userDetails);

    res.render("signUpForm", {
      title: "Sign Up",
    });
  },
];

module.exports = {
  signUpGet,
  signUpPost,
};
