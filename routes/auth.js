const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const bndm = await User.findOne({ username: req.body.username });

  if (!bndm) return res.status(400).send("Invalid username or password ");

  const validPassword = await bcrypt.compare(req.body.password, bndm.password);

  if (!validPassword) return res.status(400).send("Invalid email or password ");
  else {
    const token = jwt.sign({ _id: bndm._id }, config.get("jwtPrivateKey"));
    console.log("token: " + token);
    res
      .status(200)
      .header("x-auth-token", token)
      .send({ token: token });
  }
});

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = router;
