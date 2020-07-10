const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
}

module.exports = generateAccessToken;
