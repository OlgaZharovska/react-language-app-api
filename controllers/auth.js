const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = (req, res) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken'
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save(err => {
      if (err) {
        return res.status(401).json({
          error: err
        });
      }
      res.json({
        message: 'Signup success! Please signin.'
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup.'
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.'
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '90d'
    });

    const { _id, name } = user;
    return res.send({
      token,
      session: { authenticated: `AUTHENTICATED`, id: _id, name }
    });
  });
};

const signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success'
  });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

const forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Password reset link`,
      html: `
      <p>Please use the following link to reset your password:</p>
      <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
      <hr />
      <p>This email may contain sensetive information</p>
      <p>https://fancyapp.com</p>
  `
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sgMail.send(emailData).then(sent => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
          });
        });
      }
    });
  });
};

const preSignup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken'
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
          <p>Please use the following link to activate your acccount:</p>
          <p>${process.env.CLIENT_URL}/confirm/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>https://fancyapp.com</p>
      `
    };

    sgMail.send(emailData).then(sent => {
      return res.json({
        message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
      });
    });
  });
};

module.exports = {
  signup,
  login,
  signout,
  requireSignin,
  forgotPassword,
  preSignup
};
