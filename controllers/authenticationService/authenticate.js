const { generateRefreshToken } = require("./generateRefreshToken");

async function authenticate({ username, password }) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const JWTtoken = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    const refreshToken = generateRefreshToken(user);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      JWTtoken,
      refreshToken,
    };
  }
}

module.exports = { authenticate };
