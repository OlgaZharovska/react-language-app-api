const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;
const RefreshToken = require("../../models/refreshToken");
const User = require("../../models/user");

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || (roles.length && !roles.includes(user.role))) {
      // user no longer exists or role not authorized
      return res.status(401).json({ message: "Unauthorized" });
    }

    // authentication and authorization successful
    req.user.role = user.role;
    const refreshTokens = await RefreshToken.find({ user: user.id });
    req.user.ownsToken = (token) =>
      !!refreshTokens.find((x) => x.token === token);
    next();
  };
}

module.exports = authorize;
