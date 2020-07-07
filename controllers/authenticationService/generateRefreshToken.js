const crypto = require("crypto");
const RefreshToken = require("../../models/refreshToken");
async function generateRefreshToken(user) {
  // create a refresh token that expires in 7 days
  const token = new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  try {
    refreshToken = await token.save();
    return refreshToken;
  } catch (error) {}
}

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

module.exports = { generateRefreshToken };
