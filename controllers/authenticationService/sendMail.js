const User = require("../../models/user");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(user, req, res) {
  try {
    const token = user.generateVerificationToken();

    // Save the verification token
    await token.save();

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Account activation link`,
      html: `
          <p>Please use the following link to activate your acccount:</p>
          <p>${process.env.CLIENT_URL}/confirm/${token.token}</p>
          <hr />
          <p>If you did not request this, please ignore this email.</p>
          <p>This email may contain sensetive information</p>
          <p>https://fancyapp.com</p>
      `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.status(200).json({
          message: "A verification email has been sent to " + user.email + ".",
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Email sending failed  " + err });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { sendVerificationEmail };
