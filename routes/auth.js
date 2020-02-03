const express = require('express');
const router = express.Router();
const {
  preSignup,
  signup,
  login,
  signout,
  requireSignin,
  forgotPassword
} = require('../controllers/auth');
const runValidation = require('../validators');
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  preSignUpValidator
} = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/login', userSigninValidator, runValidation, login);
router.post(
  '/request-verification',

  preSignup
);
router.get('/signout', signout);
router.get('/secret', requireSignin, (req, res) => {
  res.json({
    message: 'you have access to secret page'
  });
});
router.put('/reset-password');
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

module.exports = router;
