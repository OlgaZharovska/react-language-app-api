const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const signup = async function (req, res) {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken",
//       });
//     }

//     const { name, email, password } = req.body;
//     let username = shortId.generate();
//     let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//     let newUser = new User({ name, email, password, profile, username });
//     newUser.save((err) => {
//       if (err) {
//         return res.status(401).json({
//           error: err,
//         });
//       }
//       res.json({
//         message: "Signup success! Please signin.",
//       });
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_LOGIN, {
      expiresIn: "90d",
    });

    try {
      await User.update({ email }, { $set: { token } });
    } catch (e) {
      console.log(e);
    }
    const { _id, name } = user;
    return res.send({
      token,
      session: { authenticated: `AUTHENTICATED`, id: _id, name },
    });
  } catch (e) {
    console.log(e);
  }
};

const signout = function (req, res) {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

const forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "User with that email does not exist",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
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
  `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sgMail.send(emailData).then((sent) => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`,
          });
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const preSignup = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
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
      `,
    };

    sgMail.send(emailData).then((sent) => {
      return res.json({
        message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
      });
    });
  } catch (e) {
    console.log;
  }
};

module.exports = {
  login,
  signout,

  forgotPassword,
  preSignup,
};
