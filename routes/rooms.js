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
  Notification,
  Scenario
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
  var token = req.query.token;

  var decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const room = await Rooms.findOne({
    name: req.body.name,
    userId: decoded._id
  });

  room.devices.rgb.forEach(async function(elm) {
    console;
    var rgb = await Rgb.findOne({ _id: elm });
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
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const sa3af = req.body.devDel.light;
  var room = await Rooms.findOne({ name: req.body.name, userId: decoded._id });
  var user = await User.findOne({ _id: room.userId });
  var error = {
    dht: false,
    gsense: false,
    rgb: false,
    ultrason: false,
    light: false,
    alarm: false
  };
  //delete
  req.body.devDel.forEach(function(e) {
    if (e[0] == "l") {
      room.devices.light.forEach(async function(elm) {
        var light = await Light.findOne({ _id: elm });
        light.used = false;
        await light.save();
      });
      room.devices.light[0] = "";
    } else if (e[0] == "r") {
      room.devices.rgb.forEach(async function(elm) {
        var rgb = await Rgb.findOne({ _id: elm });
        rgb.used = false;
        await rgb.save();
      });
      room.devices.rgb[0] = "";
    } else if (e[0] == "d") {
      room.devices.dht.forEach(async function(elm) {
        var dht = await Dht.findOne({ _id: elm });
        dht.used = false;
        await dht.save();
      });
      room.devices.dht[0] = "";
    } else if (e[0] == "u") {
      room.devices.ultrason.forEach(async function(elm) {
        var ultrason = await Ultrason.findOne({ _id: elm });
        ultrason.used = false;
        await ultrason.save();
      });
      room.devices.ultrason[0] = "";
    } else if (e[0] == "g") {
      room.devices.gsense.forEach(async function(elm) {
        var gsense = await Gsense.findOne({ _id: elm });
        gsense.used = false;
        await gsense.save();
      });
      room.devices.gsense[0] = "";
    } else if (e[0] == "a") {
      room.devices.alarm.forEach(async function(elm) {
        var alarm = await Alarm.findOne({ _id: elm });
        alarm.used = false;
        await alarm.save();
      });
      room.devices.alarm[0] = "";
    }
  });

  //doka l add
  req.body.devAdd.forEach(async function(e) {
    if (e[0] == "l") {
      var light = Light.findOne({ name: e });
      light.used = true;
      room.devices.light[0] = light._id;
      await light.save();
    } else if (e[0] == "r") {
      var rgb = await Rgb.findOne({ name: e });
      rgb.used = true;
      room.devices.rgb[0] = rgb._id;
      await rgb.save();
    } else if (e[0] == "d") {
      var dht = await Dht.findOne({ name: e });
      dht.used = true;
      room.devices.dht[0] = dht._id;
      await dht.save();
    } else if (e[0] == "u") {
      var ultrason = await Ultrason.findOne({ name: e });
      ultrason.used = true;
      room.devices.ultrason[0] = ultrason._id;
      await ultrason.save();
    } else if (e[0] == "g") {
      var gsense = await Gsense.findOne({ name: e });
      gsense.used = true;
      room.devices.gsense[0] = gsense._id;
      await gsense.save();
    } else if (e[0] == "a") {
      var alarm = await Alarm.findOne({ name: e });

      alarm.used = true;
      room.devices.alarm[0] = alarm._id;
      await alarm.save();
    }
  });

  await room.save();

  res.status(200).send({ message: "modify succesfully" });
});

//**************************************** */
router.post("/light", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const room = await Rooms.findOne({
    name: req.body.name,
    userId: decoded._id
  });
  room.devices.light.forEach(async function(id) {
    var light = await Light.findOne({ _id: id });
    light.value = req.body.value;
    light.save();
  });
  res.status(200).send({ message: "activate routine succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//

router.post("/desactiveRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const scenario = await Scenario.findOne({ _id: req.body.id });

  scenario.rooms.forEach(async function(elm) {
    var room = await Rooms.findOne({ name: elm, userId: decoded._id });
    room.devices.light.forEach(async function(id) {
      var light = await Light.findOne({ _id: id });
      light.used = true;
      light.save();
    });

    room.devices.dht.forEach(async function(id) {
      var dht = await Dht.findOne({ _id: id });
      dht.used = true;
      dht.save();
    });

    room.devices.rgb.forEach(async function(id) {
      var rgb = await Rgb.findOne({ _id: id });
      rgb.used = true;
      rgb.save();
    });
    room.devices.ultrason.forEach(async function(id) {
      var ultrason = await Ultrason.findOne({ _id: id });
      ultrason.used = true;
      ultrason.save();
    });
    room.devices.gsense.forEach(async function(id) {
      var gsense = await Gsense.findOne({ _id: id });
      gsense.used = true;
      gsense.save();
    });
    room.devices.alarm.forEach(async function(id) {
      var alarm = await Alarm.findOne({ _id: id });
      alarm.used = true;
      alarm.save();
    });
  });

  scenario.checked = false;
  scenario.save();

  res.status(200).send({ message: "desactivate routine  succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//
// TODO a changer plus tard arr
router.post("/notifications", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
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

  res.status(200).send({
    notification: JSON.stringify(notification)
  });
});

router.post("/deleteNot", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  //const token = req.query.token;

  //const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const notification = await Notification.deleteOne({ _id: req.body.id });
  var type = req.body.type;
  var i = req.body.i;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ i: i, type: type }));
});

// ********************************************************//
// ********************************************************//
router.post("/addRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const routine = new Scenario({
    name: req.body.name,
    rooms: req.body.rooms,
    color: req.body.color,
    devicesOn: req.body.devicesOn,
    devicesOff: req.body.devicesOff,
    userId: decoded._id,
    checked: false
  });
  await routine.save();

  res.status(200).send({ message: "add routine  succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//
router.post("/modifyRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const sc = await Scenario.findOne({ _id: req.body.id });

  sc.name = req.body.name;
  sc.rooms = req.body.rooms;
  sc.color = req.body.color;
  sc.devicesOff = req.body.devicesOff;
  sc.devicesOn = req.body.devicesOn;

  await sc.save();

  res.status(200).send({ message: "modify routine  succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//

router.post("/activeRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const scenario = await Scenario.findOne({ _id: req.body.id });

  scenario.rooms.forEach(async function(elm) {
    const room = await Rooms.findOne({ name: elm, userId: decoded._id });

    Object.entries(scenario.devicesOn).forEach(async function(r) {
      if (r[0] == "dht") {
        room.devices.dht.forEach(async function(e) {
          const dht = await Dht.findOne({ _id: e });
          if (r[1] == true) {
            dht.used = true;
            await dht.save();
          }
        });
      } else if (r[0] == "rgb") {
        room.devices.rgb.forEach(async function(e) {
          const rgb = await Rgb.findOne({ _id: e });
          if (r[1] == true) {
            rgb.used = true;
            await rgb.save();
          }
        });
      } else if (r[0] == "light") {
        room.devices.light.forEach(async function(e) {
          const light = await Light.findOne({ _id: e });
          if (r[1] == true) {
            light.used = true;
            light.value = true;
            await light.save();
          }
        });
      } else if (r[0] == "ultrason") {
        room.devices.ultrason.forEach(async function(e) {
          const ultrason = await Ultrason.findOne({ _id: e });
          if (r[1] == true) {
            ultrason.used = true;
            await ultrason.save();
          }
        });
      } else if (r[0] == "alarm") {
        room.devices.alarm.forEach(async function(e) {
          const alarm = await Alarm.findOne({ _id: e });
          if (r[1] == true) {
            alarm.used = true;
            await alarm.save();
          }
        });
      } else if (r[0] == "gsense") {
        room.devices.gsense.forEach(async function(e) {
          const gsense = await Gsense.findOne({ _id: e });
          if (r[1] == true) {
            gsense.used = true;
            await gsense.save();
          }
        });
      }
    });
    Object.entries(scenario.devicesOff).forEach(async function(r) {
      if (r[0] == "dht") {
        room.devices.dht.forEach(async function(e) {
          const dht = await Dht.findOne({ _id: e });
          if (r[1] == false) {
            dht.used = false;
            await dht.save();
          }
        });
      } else if (r[0] == "rgb") {
        room.devices.rgb.forEach(async function(e) {
          const rgb = await Rgb.findOne({ _id: e });
          if (r[1] == false) {
            console.log("rgb");
            rgb.used = false;
            await rgb.save();
            console.log(rgb);
          }
        });
      } else if (r[0] == "light") {
        console.log("daaaa light");

        room.devices.light.forEach(async function(e) {
          const light = await Light.findOne({ _id: e });
          if (r[1] == false) {
            console.log("light");
            light.used = false;
            await light.save();
          }
        });
      } else if (r[0] == "ultrason") {
        room.devices.ultrason.forEach(async function(e) {
          const ultrason = await Ultrason.findOne({ _id: e });
          if (r[1] == false) {
            ultrason.used = false;
            await ultrason.save();
          }
        });
      } else if (r[0] == "alarm") {
        room.devices.alarm.forEach(async function(e) {
          const alarm = await Alarm.findOne({ _id: e });
          if (r[1] == false) {
            alarm.used = false;
            await alarm.save();
          }
        });
      } else if (r[0] == "gsense") {
        room.devices.gsense.forEach(async function(e) {
          const gsense = await Gsense.findOne({ _id: e });
          if (r[1] == false) {
            gsense.used = false;
            await gsense.save();
          }
        });
      }
    });
  });
  scenario.checked = true;
  await scenario.save();

  res.status(200).send({ message: "activate routine  succesfully" }); //anglais mkwd laghlb
});

// ********************************************************//
router.get("/all", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const user = await User.findOne({ _id: decoded._id });
  var devices = new Array();

  const dht = await Dht.find({
    tokenId: user.tokenId
  });
  const rgb = await Rgb.find({
    tokenId: user.tokenId
  });
  const alarm = await Alarm.find({
    tokenId: user.tokenId
  });
  const ultrason = await Ultrason.find({
    tokenId: user.tokenId
  });
  const gsense = await Gsense.find({
    tokenId: user.tokenId
  });
  const light = await Light.find({
    tokenId: user.tokenId
  });
  const routine = await Scenario.find({ userId: decoded._id });
  const notification = await Notification.find({ _id: decoded._id });
  const _rooms = await Rooms.find({ userId: decoded._id });

  _rooms.forEach(function(elm) {
    elm.devices.dht.forEach(function(e) {});
  });

  rgb.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });
  dht.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });
  gsense.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });
  light.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });
  alarm.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });
  ultrason.forEach(function(elm) {
    if (elm.used == false) {
      devices.push(elm.name);
    }
  });

  res.render("rooms/index2.ejs", {
    rooms: JSON.stringify(_rooms),
    dht: JSON.stringify(dht),
    rgb: JSON.stringify(rgb),
    light: JSON.stringify(light),
    gsense: JSON.stringify(gsense),
    alarm: JSON.stringify(alarm),
    ultrason: JSON.stringify(ultrason),
    notification: JSON.stringify(notification),
    routine: JSON.stringify(routine),
    devices: JSON.stringify({ devices: devices })
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

router.post("/modeR", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const user = await User.findOne({ _id: decoded._id });
  let dev = new Array();
  let devA = new Array();

  const room = await Rooms.findOne({ _id: req.body.id });

  room.devices.dht.forEach(async function(elm) {
    if (elm != "") {
      const dht = await Dht.findOne({ _id: elm });
      dev.push(dht.name);
    }
  });
  room.devices.rgb.forEach(async function(elm) {
    if (elm != "") {
      const rgb = await Rgb.findOne({ _id: elm });
      dev.push(rgb.name);
    }
  });
  room.devices.alarm.forEach(async function(elm) {
    if (elm != "") {
      const alarm = await Alarm.findOne({ _id: elm });
      dev.push(alarm.name);
    }
  });
  room.devices.light.forEach(async function(elm) {
    if (elm != "") {
      const light = await Light.findOne({ _id: elm });
      dev.push(light.name);
    }
  });
  room.devices.ultrason.forEach(async function(elm) {
    if (elm != "") {
      const ultrason = await Ultrason.findOne({ _id: elm });
      dev.push(ultrason.name);
    }
  });
  room.devices.gsense.forEach(async function(elm) {
    if (elm != "") {
      const gsense = await Gsense.findOne({ _id: elm });
      dev.push(gsense.name);
    }
  });

  if (room.devices.dht[0] == "") {
    const dht = await Dht.find({ tokenId: user.tokenId });

    dht.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  if (room.devices.gsense[0] == "") {
    const gsense = await Gsense.find({ tokenId: user.tokenId });

    gsense.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  if (room.devices.alarm[0] == "") {
    const alarm = await Alarm.find({ tokenId: user.tokenId });

    alarm.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  if (room.devices.rgb[0] == "") {
    const rgb = await Rgb.find({ tokenId: user.tokenId });

    rgb.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  if (room.devices.light[0] == "") {
    const light = await Light.find({ tokenId: user.tokenId });

    light.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  if (room.devices.ultrason[0] == "") {
    const ultrason = await Ultrason.find({ tokenId: user.tokenId });

    ultrason.forEach(function(elm) {
      if (elm.used == false) {
        devA.push(elm.name);
      }
    });
  }

  setTimeout(function() {
    res.end(JSON.stringify({ devicesToDelete: dev, devicesToAdd: devA }));
  }, 500);
});

//get devices for add room
router.get("/devices", auth, async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
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

router.post("/deleteRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const i = req.body.i;
  const routine = await Scenario.deleteOne({ name: req.body.name });

  res.status(200).send({ message: "delete routine  succesfully", i: i }); //anglais mkwd laghlb
});
// ********************************************************//
//*****************************************************//

//update room
router.put("/:id", async function(req, res) {
  //const user = await User.findOne({ _id : req.userId});*
  const room = await Rooms.findOne({ _id: req.params.id });
  room.name = req.body.name;
  room.typeRoom = req.body.typeRoom;
  const result = await room.save();

  res.send(result);
});

//delete room
router.delete("/delete", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  var room = await Rooms.findOne({ name: req.body.name, userId: decoded._id });

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
