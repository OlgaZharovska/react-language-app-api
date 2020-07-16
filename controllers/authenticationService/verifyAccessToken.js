var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authorization =
    req.headers["authorization"] || req.headers["Authorization"];
  const bearer =
    authorization && authorization.startsWith("Bearer ") ? authorization : null;
  const token = bearer ? bearer.split("Bearer ")[1] : null;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.json({
          error: true,
          message: "Failed to authenticate token.",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
};
