const auth = require("../middlwares/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  Dht,
  Light,
  Alarm,
  Rgb,
  Gsense,
  Ultrason,
  validate,
  Rooms
} = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = await validate(
    _.pick(req.body, ["username", "password", "email"])
  );
  if (error) return res.status(400).send(error.details[0].message);
  const userTest = await User.findOne({ email: req.body.email });
  if (userTest) return res.status(400).send("User already Registered");

  //devices

  const bndm = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    tokenId: req.body.tokenId
  });
  const salt = await bcrypt.genSalt(10);

  bndm.password = await bcrypt.hash(bndm.password, salt);

  await bndm.save();

  const token = jwt.sign({ _id: bndm._id }, config.get("jwtPrivateKey"));
  res
    .header("x-auth-token", token)
    .send(_.pick(bndm, ["_id", "username", "email"]));
});

module.exports = router;
