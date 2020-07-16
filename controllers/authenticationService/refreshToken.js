const RefreshToken = require("../../models/refreshToken");
const User = require("../../models/user");

const generateRefreshToken = require("./generateRefreshToken");
const generateAccessToken = require("./generateAccessToken");
async function refreshToken(token) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;
  const userModel = await User.findById(user);
  const newRefreshToken = await generateRefreshToken(userModel);
  refreshToken.revoked = Date.now();
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  const jwtToken = await generateAccessToken(userModel);
  console.log(jwtToken);
  const { id } = userModel;
  return {
    id,
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function getRefreshToken(token) {
  try {
  } catch (error) {}
  const refreshToken = await RefreshToken.findOne({ token });
  console.log(refreshToken);
  if (!refreshToken) throw "No token";
  if (Date.now() >= refreshToken.expires && refreshToken.revoked)
    throw "Expired token";
  return refreshToken;
}

module.exports = refreshToken;
