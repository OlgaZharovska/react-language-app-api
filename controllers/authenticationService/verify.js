const verify = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token)
      return res
        .status(400)
        .json({
          message:
            "We were unable to find a valid token. Your token my have expired.",
        });

    // If we found a token, find a matching user
    User.findOne({ _id: token.userId }, (err, user) => {
      if (!user)
        return res
          .status(400)
          .json({ message: "We were unable to find a user for this token." });

      if (user.isVerified)
        return res
          .status(400)
          .json({ message: "This user has already been verified." });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) return res.status(500).json({ message: err.message });

        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
