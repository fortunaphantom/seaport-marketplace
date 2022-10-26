const config = require("dotenv").config().parsed;

module.exports = {
  ...config,
  PORT: 4000,
};
