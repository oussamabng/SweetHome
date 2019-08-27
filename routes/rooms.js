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
  Scenario,
  ArmingMode
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

  var arr = {
    rgb: [""],
    dht: [""],
    gsense: [""],
    ultrason: [""],
    light: [""],
    alarm: [""]
  };
  // tableau li rslthoulak te3 Devices bsh ykoun user mkhyr manah li bgha ykhdem bihom

  req.body.devices.forEach(async function(elm) {
    try {
      if (elm[0] == "d") {
        var dht = await Dht.findOne({ name: elm, tokenId: user.tokenId });
        dht.used = true;
        arr.dht[0] = dht._id;
        await dht.save();
      } else if (elm[0] == "r") {
        var rgb = await Rgb.findOne({ name: elm, tokenId: user.tokenId });
        rgb.used = true;
        arr.rgb[0] = rgb._id;
        await rgb.save();
      } else if (elm[0] == "u") {
        var ultrason = await Ultrason.findOne({
          name: elm,
          tokenId: user.tokenId
        });
        ultrason.used = true;
        arr.ultrason = new Array();
        arr.ultrason.push(ultrason._id);
        await ultrason.save();
      } else if (elm[0] == "l") {
        var light = await Light.findOne({ name: elm, tokenId: user.tokenId });
        light.used = true;
        arr.light[0] = light._id;
        await light.save();
      } else if (elm[0] == "a") {
        var alarm = await Alarm.findOne({ name: elm, tokenId: user.tokenId });
        alarm.used = true;
        arr.alarm[0] = alarm._id;
        await alarm.save();
      } else if (elm[0] == "g") {
        var gsense = await Gsense.findOne({ name: elm, tokenId: user.tokenId });
        gsense.used = true;
        arr.gsense[0] = gsense._id;
        await gsense.save();
      }
    } catch (error) {
      console.log(error);
    }
  });
  setTimeout(function() {
    res.status(200).send({
      message: "passing arr of devices succesfully",
      arr: arr,
      type: req.body.type,
      name: req.body.name
    });
  }, 500);

  //await room.save();
  //await user.save();
});

//teh RGB ROute ^^
router.post("/rgb", async function(req, res) {
  var token = req.query.token;

  var decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  var rgb = await Rgb.findOne({ _id: req.body.id });

  rgb.used = true;

  rgb.color = req.body.color;

  await rgb.save();

  res.status(200).send({ msg: "rgb color changed successfully" });
});
// TODO modify devices ................................................................;

router.post("/modify", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  var user = await User.findOne({ _id: decoded._id });
  var arr = {
    dht: false,
    rgb: false,
    light: false,
    gsense: false,
    alarm: false,
    ultrason: false
  };
  try {
    //delete
    req.body.devDel.forEach(async function(e) {
      var room = await Rooms.findOne({
        name: req.body.name,
        userId: decoded._id
      });
      if (e[0] == "l") {
        room.devices.light.forEach(async function(elm) {
          var light = await Light.findOne({ _id: elm });
          light.used = false;
          arr.light = true;
          await light.save();
        });
      } else if (e[0] == "r") {
        room.devices.rgb.forEach(async function(elm) {
          var rgb = await Rgb.findOne({ _id: elm });
          rgb.used = false;
          arr.rgb = true;

          await rgb.save();
        });
      } else if (e[0] == "d") {
        room.devices.dht.forEach(async function(elm) {
          var dht = await Dht.findOne({ _id: elm });
          dht.used = false;
          arr.dht = true;
          await dht.save();
        });
      } else if (e[0] == "u") {
        room.devices.ultrason.forEach(async function(elm) {
          var ultrason = await Ultrason.findOne({ _id: elm });
          ultrason.used = false;
          arr.ultrason = true;
          await ultrason.save();
        });
      } else if (e[0] == "g") {
        room.devices.gsense.forEach(async function(elm) {
          var gsense = await Gsense.findOne({ _id: elm });
          gsense.used = false;
          arr.gsense = true;
          await gsense.save();
        });
      } else if (e[0] == "a") {
        room.devices.alarm.forEach(async function(elm) {
          var alarm = await Alarm.findOne({ _id: elm });
          alarm.used = false;
          arr.alarm = true;
          await alarm.save();
        });
      }
    });

    //doka l add
    req.body.devAdd.forEach(async function(e) {
      if (e[0] == "l") {
        var light = await Light.findOne({ name: e, tokenId: user.tokenId });
        light.used = true;
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });

        room.devices.light = new Array();
        room.devices.light.push(light._id);
        await room.save();

        await light.save();
      } else if (e[0] == "r") {
        var rgb = await Rgb.findOne({ name: e, tokenId: user.tokenId });
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });
        rgb.used = true;
        room.devices.rgb = new Array();
        room.devices.rgb.push(rgb._id);
        await room.save();

        await rgb.save();
      } else if (e[0] == "d") {
        var dht = await Dht.findOne({ name: e, tokenId: user.tokenId });
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });
        dht.used = true;
        room.devices.dht = new Array();
        room.devices.dht.push(dht._id);
        await room.save();

        await dht.save();
      } else if (e[0] == "u") {
        var ultrason = await Ultrason.findOne({
          name: e,
          tokenId: user.tokenId
        });
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });
        ultrason.used = true;
        room.devices.ultrason = new Array();
        room.devices.ultrason.push(ultrason._id);
        await room.save();

        await ultrason.save();
      } else if (e[0] == "g") {
        var gsense = await Gsense.findOne({ name: e, tokenId: user.tokenId });
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });
        gsense.used = true;
        room.devices.gsense = new Array();
        room.devices.gsense.push(gsense._id);
        await room.save();
        await gsense.save();
      } else if (e[0] == "a") {
        var alarm = await Alarm.findOne({ name: e, tokenId: user.tokenId });
        var room = await Rooms.findOne({
          name: req.body.name,
          userId: decoded._id
        });
        alarm.used = true;
        room.devices.alarm = new Array();
        room.devices.alarm.push(alarm._id);
        await room.save();

        await alarm.save();
      }
    });
  } catch (error) {
    console.log("eroor" + error);
  }

  setTimeout(function() {
    res.status(200).send({
      msg: "modify room success",
      arr: arr,
      name: req.body.name,
      newName: req.body.newName
    });
  }, 300);
});

//**************************************** */
router.post("/light", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  var light = await Light.findOne({ _id: req.body.id });

  light.value = req.body.value;

  await light.save();
  res.status(200).send({ message: "light change succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//
// ********************************************************//
// ********************************************************//
// ********************************************************//

router.post("/desactiveRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const scenario = await Scenario.findOne({
    _id: req.body.id,
    userId: decoded._id
  });

  scenario.rooms.forEach(async function(elm) {
    var room = await Rooms.findOne({ name: elm, userId: decoded._id });
    if (room) {
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
    }
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

  const alarm = await Alarm.findOne({ _id: req.body.id });
  alarm.value = false;
  alarm.save();

  const room = await Rooms.find();
  room.forEach(function(data) {
    data.devices.alarm.forEach(function(id) {
      if (id == req.body.id) {
        arr.push(data.name);
      }
    });
  });
  res.status(200).send(arr);
});

// ********************************************************//
router.post("/val", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const notif = await Notification.findOne({ _id: req.body.id });
  if (notif) {
    notif.a.val = false;
  }
  await notif.save();
  res.status(200).send({ msg: "val succes" });
});
// ********************************************************//
router.post("/ArmingMode", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const user = await User.findOne({ _id: decoded._id });
  const ar = await ArmingMode.findOne({ tokenId: user.tokenId });
  ar.value = req.body.value;

  await ar.save();

  res.status(200).send({ msg: "ArmingMode change value success" });
});

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
  try {
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
  } catch (error) {
    res.status(404).send({ message: "err add routine", err: error }); //anglais mkwd laghlb
  }

  res.status(200).send({ message: "add routine  succesfully" }); //anglais mkwd laghlb
});
// ********************************************************//
router.post("/modifyRoutine", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const sc = await Scenario.findOne({ _id: req.body.id });
  const arr = ["red", "purple", "yellow", "green", "bleu"];
  try {
    arr.forEach(function(elm) {
      if (elm == req.body.color) {
        sc.color = req.body.color;
      }
    });
    sc.name = req.body.name;
    if (req.body.rooms.length != 0) {
      sc.rooms = req.body.rooms;
    }
    if (Object.entries(req.body.devicesOff).length != 0) {
      sc.devicesOff = req.body.devicesOff;
    }

    if (Object.entries(req.body.devicesOn).length != 0) {
      sc.devicesOn = req.body.devicesOn;
    }

    await sc.save();
  } catch (error) {
    res.status(404).send({ message: "err add routine", err: error }); //anglais mkwd laghlb
  }

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
        if (room) {
          room.devices.dht.forEach(async function(e) {
            if (e != "") {
              const dht = await Dht.findOne({ _id: e });
              if (r[1] == true) {
                dht.used = true;
                await dht.save();
              }
            }
          });
        }
      } else if (r[0] == "rgb") {
        if (room) {
          room.devices.rgb.forEach(async function(e) {
            if (e != "") {
              const rgb = await Rgb.findOne({ _id: e });
              if (r[1] == true) {
                rgb.used = true;
                await rgb.save();
              }
            }
          });
        }
      } else if (r[0] == "light") {
        if (room) {
          room.devices.light.forEach(async function(e) {
            if (e != "") {
              const light = await Light.findOne({ _id: e });
              if (r[1] == true) {
                light.used = true;
                light.value = true;
                await light.save();
              }
            }
          });
        }
      } else if (r[0] == "ultrason") {
        if (room) {
          room.devices.ultrason.forEach(async function(e) {
            if (e != "") {
              const ultrason = await Ultrason.findOne({ _id: e });
              if (r[1] == true) {
                ultrason.used = true;
                await ultrason.save();
              }
            }
          });
        }
      } else if (r[0] == "alarm") {
        if (room) {
          room.devices.alarm.forEach(async function(e) {
            if (e != "") {
              const alarm = await Alarm.findOne({ _id: e });
              if (r[1] == true) {
                alarm.used = true;
                await alarm.save();
              }
            }
          });
        }
      } else if (r[0] == "gsense") {
        if (room) {
          room.devices.gsense.forEach(async function(e) {
            if (e != "") {
              const gsense = await Gsense.findOne({ _id: e });
              if (r[1] == true) {
                gsense.used = true;
                await gsense.save();
              }
            }
          });
        }
      }
    });

    Object.entries(scenario.devicesOff).forEach(async function(r) {
      if (r[0] == "dht") {
        if (room) {
          room.devices.dht.forEach(async function(e) {
            if (e != "") {
              const dht = await Dht.findOne({ _id: e });
              if (r[1] == false) {
                dht.used = false;
                await dht.save();
              }
            }
          });
        }
      } else if (r[0] == "rgb") {
        if (room) {
          room.devices.rgb.forEach(async function(e) {
            if (e != "") {
              const rgb = await Rgb.findOne({ _id: e });
              if (r[1] == false) {
                rgb.used = false;
                await rgb.save();
              }
            }
          });
        }
      } else if (r[0] == "light") {
        if (room) {
          room.devices.light.forEach(async function(e) {
            if (e != "") {
              const light = await Light.findOne({ _id: e });
              if (r[1] == false) {
                light.value = false;
                light.used = false;
                await light.save();
              }
            }
          });
        }
      } else if (r[0] == "ultrason") {
        if (room) {
          room.devices.ultrason.forEach(async function(e) {
            if (e != "") {
              const ultrason = await Ultrason.findOne({ _id: e });
              if (r[1] == false) {
                ultrason.used = false;
                await ultrason.save();
              }
            }
          });
        }
      } else if (r[0] == "alarm") {
        if (room) {
          room.devices.alarm.forEach(async function(e) {
            if (e != "") {
              const alarm = await Alarm.findOne({ _id: e });
              if (r[1] == false) {
                alarm.used = false;
                await alarm.save();
              }
            }
          });
        }
      } else if (r[0] == "gsense") {
        if (room) {
          room.devices.gsense.forEach(async function(e) {
            if (e != "") {
              const gsense = await Gsense.findOne({ _id: e });
              if (r[1] == false) {
                gsense.used = false;
                await gsense.save();
              }
            }
          });
        }
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
  var value;
  const user = await User.findOne({ _id: decoded._id });
  const check = user.check;
  var devices = new Array();

  const ar = await ArmingMode.findOne({ tokenId: user.tokenId });

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
  const notification = await Notification.find({ userId: decoded._id });

  const _rooms = await Rooms.find({ userId: decoded._id });

  const dht1 = await Dht.findOne({
    tokenId: user.tokenId,
    used: false
  });
  const rgb1 = await Rgb.findOne({
    tokenId: user.tokenId,
    used: false
  });
  const alarm1 = await Alarm.findOne({
    tokenId: user.tokenId,
    used: false
  });
  const ultrason1 = await Ultrason.findOne({
    tokenId: user.tokenId,
    used: false
  });
  const gsense1 = await Gsense.findOne({
    tokenId: user.tokenId,
    used: false
  });
  const light1 = await Light.findOne({
    tokenId: user.tokenId,
    used: false
  });

  if (rgb1) {
    devices.push(rgb1.name);
  }

  if (dht1) {
    devices.push(dht1.name);
  }

  if (gsense1) {
    devices.push(gsense1.name);
  }

  if (light1) {
    devices.push(light1.name);
  }

  if (alarm1) {
    devices.push(alarm1.name);
  }

  if (ultrason1) {
    devices.push(ultrason1.name);
  }
  if (ar) {
    value = ar.value;
  }
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
    devices: JSON.stringify({ devices: devices }),
    check: check,
    armingMode: value
  });
});
// get rooms
//router.get("/", auth, async function(req, res) {
//console.log(req.userId);

router.post("/room", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const room = new Rooms({
    userId: decoded._id,
    name: req.body.name,
    typeRoom: req.body.type,
    devices: req.body.devices
  });
  await room.save();

  res.status(200).send({ message: "room  added succesfully post   succes" }); //anglais mkwd laghlb
});

//const rooms = await Rooms.find({ userId: req.userId._id });
router.post("/ver", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  var scenario = await Scenario.find({ userId: decoded._id });

  var ver = false;

  for (var j = 0; j < scenario.length; j++) {
    if (scenario[j]._id != req.body.id) {
      if (scenario[j].checked == true) {
        ver = true;
        break;
      }
    }
  }

  res.status(200).send({ message: "check post   succes", ver: ver });
});
//console.log(rooms);
//res.send(rooms);
//});
router.post("/check", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const user = await User.findOne({ _id: decoded._id });
  user.check = req.body.check;

  await user.save();

  res.status(200).send({ message: "check post   succes" }); //anglais mkwd laghlb
});
// ********************************************************//
router.post("/delDev", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  const room = await Rooms.findOne({
    name: req.body.name,
    userId: decoded._id
  });
  if (req.body.name != req.body.newName) {
    room.name = req.body.newName;
  }
  if (req.body.arr.dht) {
    room.devices.dht = new Array("");

    room.devices.dht[0] = "";
  }

  if (req.body.arr.rgb) {
    room.devices.rgb = new Array("");

    room.devices.rgb[0] = "";
  }

  if (req.body.arr.alarm) {
    room.devices.alarm = new Array("");

    room.devices.alarm[0] = "";
  }

  if (req.body.arr.light) {
    room.devices.light = new Array("");

    room.devices.light[0] = "";
  }

  if (req.body.arr.ultrason) {
    room.devices.ultrason = new Array("");
    room.devices.ultrason[0] = "";
  }

  if (req.body.arr.gsense) {
    room.devices.gsense = new Array();
    room.devices.gsense[0] = "";
  }

  setTimeout(async function() {
    await room.save();

    res.status(200).send({ message: "delDev post   succes" }); //anglais mkwd laghlb
  }, 500);
});
//*****************************************************//

router.post("/modeR", async function(req, res) {
  const token = req.query.token;
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const user = await User.findOne({ _id: decoded._id });
  var dev = new Array();
  var devA = new Array();

  const room = await Rooms.findOne({ _id: req.body.id });

  if (room.devices.dht[0] != "") {
    const dht = await Dht.findOne({ _id: room.devices.dht[0] });
    dev.push(dht.name);
  }

  if (room.devices.rgb[0] != "") {
    const rgb = await Rgb.findOne({ _id: room.devices.rgb[0] });
    dev.push(rgb.name);
  }

  if (room.devices.alarm[0] != "") {
    const alarm = await Alarm.findOne({ _id: room.devices.alarm[0] });
    dev.push(alarm.name);
  }

  if (room.devices.light[0] != "") {
    const light = await Light.findOne({ _id: room.devices.light[0] });
    dev.push(light.name);
  }

  if (room.devices.ultrason[0] != "") {
    const ultrason = await Ultrason.findOne({ _id: room.devices.ultrason[0] });
    dev.push(ultrason.name);
  }

  if (room.devices.gsense[0] != "") {
    const gsense = await Gsense.findOne({ _id: room.devices.gsense[0] });
    dev.push(gsense.name);
  }

  if (room.devices.dht[0] == "") {
    const dht = await Dht.findOne({ tokenId: user.tokenId, used: false });

    devA.push(dht.name);
  }

  if (room.devices.gsense[0] == "") {
    const gsense = await Gsense.findOne({ tokenId: user.tokenId, used: false });
    devA.push(gsense.name);
  }

  if (room.devices.alarm[0] == "") {
    const alarm = await Alarm.findOne({ tokenId: user.tokenId, used: false });

    devA.push(alarm.name);
  }

  if (room.devices.rgb[0] == "") {
    const rgb = await Rgb.findOne({ tokenId: user.tokenId, used: false });

    devA.push(rgb.name);
  }

  if (room.devices.light[0] == "") {
    const light = await Light.findOne({ tokenId: user.tokenId, used: false });

    devA.push(light.name);
  }

  if (room.devices.ultrason[0] == "") {
    const ultrason = await Ultrason.findOne({
      tokenId: user.tokenId,
      used: false
    });

    devA.push(ultrason.name);
  }

  res.status(200).send({
    message: "modeR routine  succesfully",
    devicesToDelete: dev,
    devicesToAdd: devA
  }); //anglais mkwd laghlb
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

  if (room.devices.dht[0] != "") {
    const dht = await Dht.findOne({ _id: room.devices.dht[0] });
    dht.used = false;
    await dht.save();
  }
  if (room.devices.rgb[0] != "") {
    const rgb = await Rgb.findOne({ _id: room.devices.rgb[0] });
    rgb.used = false;
    await rgb.save();
  }
  if (room.devices.alarm[0] != "") {
    const alarm = await Alarm.findOne({ _id: room.devices.alarm[0] });
    alarm.used = false;
    await alarm.save();
  }
  if (room.devices.ultrason[0] != "") {
    const ultrason = await Ultrason.findOne({ _id: room.devices.ultrason[0] });
    ultrason.used = false;
    await ultrason.save();
  }
  if (room.devices.light[0] != "") {
    const light = await Light.findOne({ _id: room.devices.light[0] });
    light.used = false;
    await light.save();
  }
  if (room.devices.gsense[0] != "") {
    const gsense = await Gsense.findOne({ _id: room.devices.gsense[0] });
    gsense.used = false;
    await gsense.save();
  }
  var i = req.body.i;
  room = await Rooms.deleteOne({ name: req.body.name });
  res.send({ message: "succes of delete ", i: i });
});

module.exports = router;
