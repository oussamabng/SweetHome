const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const auth = require("../middlwares/auth");

const {
  User,
  Dht,
  Light,
  Alarm,
  Rgb,
  Gsense,
  Ultrason,
  Rooms
} = require("../models/user");
const _ = require("lodash");

// ********************************************************//
//*****************************************************//
//add room
router.post("/add", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const user = await User.findOne({ _id: decoded._id });
  //const _rooms = await Rooms.find({ userId: decoded._id });
  //const user = await User.findOne({ _id: decoded._id });
  console.log("ahh");
  console.log("ok " + decoded._id);
  // tableau li rslthoulak te3 Devices bsh ykoun user mkhyr manah li bgha ykhdem bihom

  var dhtId = "";
  var rgbId = "";
  var ultrasonId = "";
  var alarmId = "";
  var lightId = "";
  var gsenseId = "";

  if (req.body.devices.dht == true) {
    var dht = new Dht({
      name: "dht" + "-xx",
      tokenId: user.tokenId,
      used: true
    });
    dht.save();
    dhtId = dht._id;
  }

  if (req.body.devices.rgb == true) {
    console.log("hahahahahahahssss");
    var rgb = new Rgb({
      name: "rgb" + "-xx",
      tokenId: user.tokenId,
      used: true
    });
    rgb.save();
    rgbId = rgb._id;
  }

  if (req.body.devices.alarm == true) {
    var alarm = new Alarm({
      name: "alarm" + "-xx",
      tokenId: user.tokenId,
      used: true
    });
    alarm.save();
    alarmId = alarm._id;
  }
  if (req.body.devices.gsense == true) {
    var gsense = new Gsense({
      name: "gsense" + "-xx",
      tokenId: user.tokenId,
      used: true
    });
    gsense.save();
    gsenseId = gsense._id;
  }
  if (req.body.devices.light == true) {
    var light = new Light({
      name: "light" + "-xx",
      tokenId: user.tokenId,
      used: true
    });
    light.save();
    lightId = light._id;
  }
  if (req.body.devices.ultrason == true) {
    var ultrason = new Ultrason({
      name: "ultrason" + "-xx",
      tokenId: user.tokenId,
      used: true,
      value: true
    });
    ultrason.save();
    ultrasonId = ultrason._id;
  }

  let room = new Rooms({
    name: req.body.name,
    userId: decoded._id,
    typeRoom: req.body.type,
    devices: {
      dht: [dhtId],
      rgb: [rgbId],
      ultrason: [ultrasonId],
      alarm: [alarmId],
      gsense: [gsenseId],
      light: [lightId]
    }
  });
  if ((dhtId = "")) {
    room.devices.dht = [];
  }
  if ((rgbId = "")) {
    room.devices.rgb = [];
  }
  if ((lightId = "")) {
    room.devices.light = [];
  }
  if ((gsenseId = "")) {
    room.devices.gsense = [];
  }
  if ((ultrasonId = "")) {
    room.devices.ultrason = [];
  }
  if ((alarmId = "")) {
    room.devices.alarm = [];
  }

  await room.save();
  //await user.save();
  res.status(200).send("room added succesfully"); //anglais mkwd laghlb
});

router.post("/light", async function(req, res) {
  var light = await Light.findOne({ _id: req.body.id });
  light.value = req.body.value;
  light.save();

  res.send("changes completed for the light ");
});
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// TODO a changer plus tard arr
router.post("/notifications", async function(req, res) {
  var arr = [];
  const alarm = await Alarm.findOne({ _id: JSON.parse(req.body.id) });

  alarm.value = false;
  alarm.save();

  const room = await Rooms.find();
  room.forEach(function(data) {
    data.devices.alarm.forEach(function(id) {
      if (id == JSON.parse(req.body.id)) {
        arr.push(data.name);
      }
    });
  });
  console.log("arr :" + arr);
  res.status(200).send(arr);
});

// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//

// ********************************************************//
router.get("/all", async function(req, res) {
  const dht = await Dht.find();
  const rgb = await Rgb.find();
  const alarm = await Alarm.find();
  const ultrason = await Ultrason.find();
  const gsense = await Gsense.find();
  const light = await Light.find();

  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const _rooms = await Rooms.find({ userId: decoded._id });
  res.render("rooms/getrooms.ejs", {
    rooms: JSON.stringify(_rooms),
    dht: JSON.stringify(dht),
    rgb: JSON.stringify(rgb),
    light: JSON.stringify(light),
    gsense: JSON.stringify(gsense),
    alarm: JSON.stringify(alarm),
    ultrason: JSON.stringify(ultrason)
  });
});
// get rooms
//router.get("/", auth, async function(req, res) {
//console.log(req.userId);
//const rooms = await Rooms.find({ userId: req.userId._id });
//console.log(rooms);
//res.send(rooms);
//});

// ********************************************************//
//*****************************************************//

//get devices te3 kol room
router.get("/devices/:id", async function(req, res) {
  const room = await Rooms.find({ _id: req.params.id });

  let dev = [];
  dev.dhts = [];
  dev.alarms = [];
  dev.ultrasons = [];
  dev.rgbs = [];
  dev.gsenses = [];
  dev.lights = [];

  room.dht.forEach(async function(element) {
    let temp = await Dht.findOne({ _id: element });
    dev.dhts.push(temp);
  });

  room.alarm.forEach(async function(element) {
    let temp = await Alarm.findOne({ _id: element });
    dev.alarms.push(temp);
  });
  room.ultrason.forEach(async function(element) {
    let temp = await Ultrason.findOne({ _id: element });
    dev.ultrasons.push(temp);
  });
  room.rgb.forEach(async function(element) {
    let temp = await Rgb.findOne({ _id: element });
    dev.rgbs.push(temp);
  });
  room.light.forEach(async function(element) {
    let temp = await Light.findOne({ _id: element });
    dev.lights.push(temp);
  });
  room.gsense.forEach(async function(element) {
    let temp = await Gsense.findOne({ _id: element });
    dev.gsenses.push(temp);
  });

  res.send(dev, function() {
    console.log("devices getted");
  });
});

//get devices for add room
router.get("/devices", auth, async function(req, res) {
  let dev = {
    dhts: [],
    alarms: [],
    ultrasons: [],
    rgbs: [],
    gsenses: [],
    lights: []
  };

  const user = await User.find({ _id: req.userId });
  const dht = await Dht.find({ tokenId: user[0].tokenId });
  const light = await Light.find({ tokenId: user[0].tokenId });
  const ultrason = await Ultrason.find({ tokenId: user[0].tokenId });
  const alarm = await Alarm.find({ tokenId: user[0].tokenId });
  const rgb = await Rgb.find({ tokenId: user[0].tokenId });
  const gsense = await Gsense.find({ tokenId: user[0].tokenId });
  dht.forEach(element => {
    dev.dhts.push(element);
  });

  light.forEach(element => {
    dev.lights.push(element);
  });

  ultrason.forEach(element => {
    dev.ultrasons.push(element);
  });

  alarm.forEach(element => {
    dev.alarms.push(element);
  });

  rgb.forEach(element => {
    dev.rgbs.push(element);
  });

  gsense.forEach(element => {
    dev.gsenses.push(element);
  });

  res.send(dev);
  //send array of devices
});

// ********************************************************//
//*****************************************************//

//update room
router.put("/:id", async function(req, res) {
  //const user = await User.findOne({ _id : req.userId});*
  console.log(req.params.id);
  const room = await Rooms.findOne({ _id: req.params.id });
  console.log(room);
  room.name = req.body.name;
  room.typeRoom = req.body.typeRoom;
  const result = await room.save();
  console.log(result);

  res.send(result);
});

//delete room
router.delete("/:id", async function(req, res) {
  const room = await Rooms.deleteOne({ _id: req.params.id });
  res.send(room);
});

module.exports = router;
