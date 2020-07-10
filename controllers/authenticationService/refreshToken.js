const RefreshToken = require("../../models/refreshToken");
const generateRefreshToken = require("./generateRefreshToken");
const generateAccessToken = require("./generateAccessToken");
async function refreshToken(token) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;
  const newRefreshToken = generateRefreshToken(user);
  refreshToken.revoked = Date.now();
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  const jwtToken = generateAccessToken(user);
  const { id } = user;
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
