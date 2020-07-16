const verify = require("./verify");
const login = require("./login");
const refreshToken = require("./refreshToken");
const getById = require("./getById");
const getAll = require("./getAll");
const verifyAccessToken = require("./verifyAccessToken");

module.exports = {
  verify,
  login,
  refreshToken,
  verifyAccessToken,
  getById,
  getAll,
};
