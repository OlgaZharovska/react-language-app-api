const { sendVerificationEmail } = require("./sendMail");

const User = require("../../models/user");

const signup = async function (req, res) {
  try {
    const { email } = req.body;
    // Make sure this account doesn't already exist
    const user = await User.findOne({ email });

    if (user)
      return res.status(401).json({
        message:
          "The email address you have entered is already associated with another account.",
      });

    console.log(req.body);

    const newUser = new User({ ...req.body, role: "user" });

    const user_ = await newUser.save();
    sendVerificationEmail(user_, req, res);

    // const user_ = await newUser.save();
    // sendVerificationEmail(user_);

    // await sendVerificationEmail(user_, req, res);
  } catch (error) {
    return res.status(500).json({ success: false, message: "LOL" });
  }
};

module.exports = {
  signup,
};
