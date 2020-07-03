const User = require("../../models/user");

login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        msg:
          "The email address " +
          email +
          " is not associated with any account. Double-check your email address and try again.",
      });

    //validate password
    if (!user.comparePassword(password))
      return res.status(401).json({ message: "Invalid email or password" });

    // Make sure the user has been verified
    if (!user.isVerified)
      return res.status(401).json({
        type: "not-verified",
        message: "Your account has not been verified.",
      });
    delete user.password;

    // Login successful, write token, and send back user
    res.status(200).json({
      token: user.generateJWT(),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
