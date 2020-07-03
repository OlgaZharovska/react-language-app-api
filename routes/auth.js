const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authenticationService/signup");
const { verify } = require("../controllers/authenticationService/verify");
const { login } = require("../controllers/authenticationService/login");
const { preSignup, signout, forgotPassword } = require("../controllers/auth");
const runValidation = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  preSignUpValidator,
} = require("../validators/auth");

router.post("/login", login);

router.post("/signup", signup);
router.post("/verify", verify);

router.post(
  "/request-verification",

  preSignup
);
router.get("/signout", signout);

router.put("/reset-password");
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

module.exports = router;
