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
  console.log(req.body.email);
  const userTest = await User.findOne({ email: req.body.email });
  if (userTest) return res.status(400).send("User already Registered");

  //devices

  let dht = new Dht({
    name: "dht-2",
    value: [50, 40],
    tokenId: "ouss"
  });

  await dht.save();

  let light = new Light({
    name: "light-2",
    value: false,
    tokenId: "ouss"
  });
  await light.save();

  let alarm = new Alarm({
    name: "alarm-2",
    tokenId: "ouss"
  });
  await alarm.save();

  let gsense = new Gsense({
    name: "GSense-2",
    tokenId: "ouss",
    value: [
      [
        {
          smoke: 14,
          lpg: 31,
          propane: 4,
          methane: 2
        }
      ]
    ]
  });
  await gsense.save();

  let rgb = new Rgb({
    name: "rgb-2",
    state: 1,
    color: 30,
    tokenId: "ouss"
  });
  await rgb.save();

  let ultrason = new Ultrason({
    name: "ultrason-2",
    tokenId: "ouss"
  });
  await ultrason.save();

  let room = new Rooms({
    name: "chambra",
    typeRoom: "livingRoom"
  });
  await room.save();
  //end

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
