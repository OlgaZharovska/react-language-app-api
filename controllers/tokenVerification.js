var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({
          error: true,
          message: "Failed to authenticate token.",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
};
