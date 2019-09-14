const jwt = require("jsonwebtoken");
const config = require("config");
const store = require("store");

module.exports = function(req, res, next) {
  // const token = req.header("x-auth-token");

  try {
    const token = store.get("token").token;
    if (!token) return res.status(401).send("Access Denied ");
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.userId = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ msg: "invalid token" });
  }
};
