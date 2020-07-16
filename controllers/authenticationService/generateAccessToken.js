const jwt = require("jsonwebtoken");
const User = require("../../models/user");

async function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
}

module.exports = generateAccessToken;
