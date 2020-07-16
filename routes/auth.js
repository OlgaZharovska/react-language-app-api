const express = require("express");
const router = express.Router();
const Role = require("../helpers/role");
const { signup } = require("../controllers/authenticationService/signup");
const { verify } = require("../controllers/authenticationService/verify");
const { login } = require("../controllers/authenticationService/login");

const authenticationService = require("../controllers/authenticationService");
const authorize = require("../controllers/authorizationService");

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
router.get(
  "/:id",
  authenticationService.verifyAccessToken,
  authorize(),
  getById
);

// router.get("/get-all", authorize(Role.Admin), getAll);

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/signup", signup);
router.post("/verify", verify);

function getAll(req, res, next) {
  authenticationService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  // regular users can get their own record and admins can get any record
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  authenticationService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

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
