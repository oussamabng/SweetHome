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
  Rooms,
  Notification
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

  console.log("ok " + decoded._id);
  // tableau li rslthoulak te3 Devices bsh ykoun user mkhyr manah li bgha ykhdem bihom

  var dhtId = new String();
  var rgbId = new String();
  var ultrasonId = new String();
  var alarmId = new String();
  var lightId = new String();
  var gsenseId = new String();

  let dht = new Dht({
    name: "dht-" + req.body.name,
    tokenId: user.tokenId,
    used: true
  });
  let rgb = new Rgb({
    name: "rgb-" + req.body.name,
    tokenId: user.tokenId,
    used: true
  });

  let alarm = new Alarm({
    name: "alarm-" + req.body.name,
    tokenId: user.tokenId,
    used: true
  });

  let gsense = new Gsense({
    name: "gsense-" + req.body.name,
    tokenId: user.tokenId,
    used: true
  });

  let light = new Light({
    name: "light-" + req.body.name,
    tokenId: user.tokenId,
    used: true,
    value: false
  });
  let ultrason = new Ultrason({
    name: "ultrason-" + req.body.name,
    tokenId: user.tokenId,
    used: true,
    value: true
  });

  if (req.body.devices.dht == true) {
    await dht.save();
    dhtId = dht._id;
    console.log("save dht");
  }

  if (req.body.devices.rgb == true) {
    await rgb.save();
    rgbId = rgb._id;
    console.log("save rgb");
  }

  if (req.body.devices.alarm == true) {
    await alarm.save();
    alarmId = alarm._id;
    console.log("save alrm");
  }
  if (req.body.devices.gsense == true) {
    await gsense.save();
    gsenseId = gsense._id;
    console.log("save gsense");
  }
  if (req.body.devices.light == true) {
    await light.save();
    lightId = light._id;
    console.log("save light");
  }
  if (req.body.devices.ultrason == true) {
    await ultrason.save();
    ultrasonId = ultrason._id;
    console.log("save ultra");
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
  if (dhtId.length == 0) {
    room.devices.dht = new Array();
  }
  if (rgbId.length == 0) {
    room.devices.rgb = new Array();
  }
  if (lightId.length == 0) {
    room.devices.light = new Array();
  }
  if (gsenseId.length == 0) {
    room.devices.gsense = new Array();
  }
  if (ultrasonId.length == 0) {
    room.devices.ultrason = new Array();
  }
  if (alarmId.length == 0) {
    room.devices.alarm = new Array();
  }

  await room.save();
  //await user.save();
  res.status(200).send({ message: "room added succesfully" }); //anglais mkwd laghlb
});

//teh RGB ROute ^^
router.post("/rgb", async function(req, res) {
  console.log(req.body);

  const room = await Rooms.findOne({ name: req.body.name });

  room.devices.rgb.forEach(async function(elm) {
    console;
    var rgb = await Rgb.findOne({ _id: elm });
    console.log("rgb :" + rgb);
    rgb.used = true;
    rgb.color = new Array(); // rgb.color = [];  bah nkhawouh lawla ,,,, psk ykoun dima fiha ghi 3 val rgb ..
    rgb.color.push(req.body.red);
    rgb.color.push(req.body.green);
    rgb.color.push(req.body.blue);
    rgb.save();
  });

  res.status(200).send("succes rgb ^^");
});
// TODO modify devices ................................................................;

router.post("/modify", async function(req, res) {
  const sa3af = req.body.devDel.light;
  var room = await Rooms.findOne({ name: req.body.name });
  var user = await User.findOne({ _id: room.userId });
  var error = {
    dht: false,
    gsense: false,
    rgb: false,
    ultrason: false,
    light: false,
    alarm: false
  };

  if (sa3af == true) {
    room.devices.light.forEach(async function(elm) {
      console.log(elm + "     dddd");
      var light = await Light.deleteOne({ _id: elm });
    });
    room.devices.light = new Array();
  }
  if (req.body.devDel.rgb == true) {
    room.devices.rgb.forEach(async function(elm) {
      var rgb = await Rgb.deleteOne({ _id: elm });
    });
    room.devices.rgb = new Array();
  }

  if (req.body.devDel.dht == true) {
    room.devices.dht.forEach(async function(elm) {
      var dht = await Dht.deleteOne({ _id: elm });
    });
    room.devices.dht = new Array();
  }

  if (req.body.devDel.ultrason == true) {
    room.devices.ultrason.forEach(async function(elm) {
      var ultrason = await Ultrason.deleteOne({ _id: elm });
    });
    room.devices.ultrason = new Array();
  }
  if (req.body.devDel.gsense == true) {
    room.devices.gsense.forEach(async function(elm) {
      var gsense = await Gsense.deleteOne({ _id: elm });
    });
    room.devices.gsense = new Array();
  }
  if (req.body.devDel.alarm == true) {
    room.devices.alarm.forEach(async function(elm) {
      var alarm = await Alarm.deleteOne({ _id: elm });
    });
    room.devices.alarm = new Array();
  }
  // doka lal ADD
  if (req.body.devAdd.dht == true) {
    if (room.devices.dht.length == 0) {
      var dht = new Dht({
        name: "dht-" + req.body.name,
        tokenId: user.tokenId,
        used: true
      });
      await dht.save();
      room.devices.dht.push(dht._id);
    } else {
      error.dht = true;
    }
  }
  if (req.body.devAdd.rgb == true) {
    if (room.devices.rgb.length == 0) {
      var rgb = new Rgb({
        name: "rgb-" + req.body.name,
        tokenId: user.tokenId,
        used: true
      });
      await rgb.save();
      room.devices.rgb.push(rgb._id);
    } else {
      error.rgb = true;
    }
  }
  if (req.body.devAdd.alarm == true) {
    if (room.devices.alarm.length == 0) {
      var alarm = new Alarm({
        name: "alarm-" + req.body.name,
        tokenId: user.tokenId,
        used: true,
        value: false
      });
      await alarm.save();
      room.devices.alarm.push(alarm._id);
    } else {
      error.alarm = true;
    }
  }
  if (req.body.devAdd.gsense == true) {
    if (room.devices.gsense.length == 0) {
      var gsense = new Gsense({
        name: "gsense-" + req.body.name,
        tokenId: user.tokenId,
        used: true
      });
      await gsense.save();
      room.devices.gsense.push(gsense._id);
    } else {
      error.gsense = true;
    }
  }
  if (req.body.devAdd.ultrason == true) {
    if (room.devices.ultrason.length == 0) {
      var ultrason = new Ultrason({
        name: "ultrason-" + req.body.name,
        tokenId: user.tokenId,
        used: true
      });
      await ultrason.save();
      room.devices.ultrason.push(ultrason._id);
    } else {
      error.ultrason = true;
    }
  }
  if (req.body.devAdd.light == true) {
    if (room.devices.light.length == 0) {
      var light = new Light({
        name: "light-" + req.body.name,
        tokenId: user.tokenId,
        used: true,
        value: false
      });
      await light.save();
      room.devices.light.push(light._id);
    } else {
      error.light = true;
    }
  }
  await room.save();
  res.status(200).send({ message: "modify succesfully", err: error });
});

//**************************************** */
router.post("/light", async function(req, res) {
  const room = await Rooms.findOne({ name: req.body.name });
  room.devices.light.forEach(async function(id) {
    var light = await Light.findOne({ _id: id });
    light.value = req.body.value;
    light.save();
  });

  res.status(200).send("changes completed for the light ");
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

router.post("/getnotifications", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const notification = new Notification({
    type: req.body.type,
    content: req.body.content,
    time: req.body.time,
    userId: decoded._id
  });
  await notification.save();
  console.log("okbb : " + notification);

  res.status(200).send({
    notification: JSON.stringify(notification)
  });
});

router.post("/deleteNot", async function(req, res) {
  //const token = req.query.token;

  //const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const notification = await Notification.deleteOne({ _id: req.body.id });
  console.log("type delete notif :" + req.body.type);
  var type = req.body.type;
  var i = req.body.i;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ i: i, type: type }));
});

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
  const notification = await Notification.find();
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const _rooms = await Rooms.find({ userId: decoded._id });
  res.render("rooms/index2.ejs", {
    rooms: JSON.stringify(_rooms),
    dht: JSON.stringify(dht),
    rgb: JSON.stringify(rgb),
    light: JSON.stringify(light),
    gsense: JSON.stringify(gsense),
    alarm: JSON.stringify(alarm),
    ultrason: JSON.stringify(ultrason),
    notification: JSON.stringify(notification)
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
router.delete("/delete", async function(req, res) {
  var room = await Rooms.findOne({ name: req.body.name });

  const user = await User.findOne({ _id: room.userId });

  const dht = await Dht.deleteOne({ _id: room.devices.dht[0] });
  const rgb = await Rgb.deleteOne({ _id: room.devices.rgb[0] });
  const alarm = await Alarm.deleteOne({ _id: room.devices.alarm[0] });
  const light = await Light.deleteOne({ _id: room.devices.light[0] });
  const ultrason = await Ultrason.deleteOne({ _id: room.devices.ultrason[0] });
  const gsense = await Gsense.deleteOne({ _id: room.devices.gsense[0] });

  room = await Rooms.deleteOne({ name: req.body.name });
  res.send({ message: "succes of delete " });
});

module.exports = router;
