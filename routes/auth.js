const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authenticationService/signup");
const { verify } = require("../controllers/authenticationService/verify");
const { login } = require("../controllers/authenticationService/login");

const authenticationService = require("../controllers/authenticationService");

function refreshToken(req, res) {
  const reqRefreshToken = req.body.token || req.cookies.token;
  authenticationService.refreshToken(reqRefreshToken).then((info) => {
    res.status(200).json({ info });
  });
}

// const { preSignup, signout, forgotPassword } = require("../controllers/auth");

// const runValidation = require("../validators");
// const {
//   userSignupValidator,
//   userSigninValidator,
//   forgotPasswordValidator,
//   resetPasswordValidator,
//   preSignUpValidator,
// } = require("../validators/auth");

router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.post("/signup", signup);
router.post("/verify", verify);

// router.post(
//   "/request-verification",

//   preSignup
// );
// router.get("/signout", signout);

// router.put("/reset-password");
// router.put(
//   "/forgot-password",
//   forgotPasswordValidator,
//   runValidation,
//   forgotPassword
// );

module.exports = router;
