const express = require("express");
const app = express();
const webPush = require("web-push");
var schedule = require("node-schedule");

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
} = require("./models/user");
//const path = require("path");
const config = require("config");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const signIn = require("./routes/signIn");
const forgot = require("./routes/forgot");
var bodyParser = require("body-parser");
const reset = require("./routes/reset");
const rooms = require("./routes/rooms");
const notifications = require("./routes/notifications");

//const csrf = require("csurf");
//var bodyParser = require("body-parser");

//var csrfProtection = csrf({ cookie: true });
//const {User , Dht , Light , Alarm , Rgb , Gsense , Ultrason , Rooms}= require('./models/user');
var Pusher = require("pusher");

var pusher = new Pusher({
  appId: "779875",
  key: "28874f2f3bdf02b787e5",
  secret: "bc020c336261d79ccb2e",
  cluster: "eu"
  //  encrypted: true
});
const publicVapidKey =
  "BJV-kW194n9pPboPEBQAmwW3L7bbH3GFDcBiYmYqjvJFFIz6i8CuZXJfjUqrrzgYI5hM_ZYkGVEYlKKKHkQ9BuI";

const privateVapidKey = "zpoAJ0x4LrnI3ayrpmjh2INcPrAcPTdWcmwVGKtK6k8";

// TODO app.use(express.static(path.join(__dirname, "client")));

webPush.setVapidDetails(
  "mailto:test@example.com",
  publicVapidKey,
  privateVapidKey
);

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: "Push notifications with Service Workers"
  });

  webPush
    .sendNotification(subscription, payload)
    .catch(error => console.error(error));
});

// TODO nada

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

if (!config.get("jwtPrivateKey")) {
  console.log("fatal ERRoR");
  process.exit(1);
}

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

mongoose.connect("mongodb://localhost/SweetHome?replicaSet=rs", {
  useCreateIndex: true,
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error:"));

db.once("open", () => {
  app.listen(3000, () => {
    console.log("Listening on port :  3000");
  });
  const utrasonCollection = db.collection("ultrasons");
  const alarmCollection = db.collection("alarms");
  const scenarioCollection = db.collection("scenarios");
  var arr = [];

  const changeStreamScenario = scenarioCollection.watch();
  const changeStream = alarmCollection.watch();
  const changeStreamUltrason = utrasonCollection.watch();

  changeStreamScenario.on("change", async function(change) {
    console.log(change.operationType);

    if (change.operationType === "update") {
      var id = change.documentKey._id;
      const scenario = await Scenario.findOne({ _id: id });
      if (scenario.update == true) {
        var j = schedule.scheduleJob(
          ` ${scenario.time.slice(3)} ${scenario.time.slice(0, 2)} * * ${
            scenario.repeat
          }`,
          async function() {
            scenario.rooms.forEach(async function(elm) {
              const room = await Rooms.findOne({
                name: elm,
                userId: scenario.userId
              });

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
                          console.log("dar ultrason false");
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
            scenario.update = false;
            await scenario.save();

            pusher.trigger("inserted", "scenario", {
              //TODO to add //data : change.fullDocument.data
              message: "pusher scenario"
            });
            //end
          }
        );
      }
    }

    if (change.operationType === "insert") {
      var id = change.documentKey._id;
      const scenario = await Scenario.findOne({ _id: id });

      if (scenario.time != "" && scenario.repeat != "") {
        var j = schedule.scheduleJob(
          ` ${scenario.time.slice(3)} ${scenario.time.slice(0, 2)} * * ${
            scenario.repeat
          }`,
          async function() {
            scenario.rooms.forEach(async function(elm) {
              const room = await Rooms.findOne({
                name: elm,
                userId: scenario.userId
              });

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
                          console.log("dar ultrason false");
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

            pusher.trigger("inserted", "scenario", {
              //TODO to add //data : change.fullDocument.data
              message: "pusher scenario"
            });
            //end
          }
        );
      }
    }
  });

  changeStreamUltrason.on("change", async function(change) {
    if (change.operationType === "replace") {
      const user = await User.findOne({ tokenId: change.fullDocument.tokenId });
      var room = await Rooms.find({ userId: user._id });
      room.forEach(async function(elm) {
        if (elm.devices.ultrason[0] == change.fullDocument._id) {
          pusher.trigger("inserted", "ultrason", {
            //TODO to add //data : change.fullDocument.data
            id: change.fullDocument._id,
            name: elm.name,
            value: change.fullDocument.value
          });
          // notif = new Notification({
          // type: "ultrason",
          // content: "door action happend",
          //time: new Date().toString().substring(0, 24),
          // userId: user._id,
          // a: {
          //  val: true,
          //   id: change.fullDocument._id,
          // nameRoom: elm.name
          // }
          //});
          //  await notif.save();
        }
      });
    }
  });

  changeStream.on("change", async function(change) {
    var id = change.documentKey._id;
    console.log({ id: id });
    var alarm = await Alarm.findOne({ _id: id });
    if (change.operationType === "update" && alarm.value == true) {
      var user = await User.findOne({ tokenId: alarm.tokenId });
      user.check = false;
      var bool = false;
      var rooms = await Rooms.find({ userId: user._id });
      for (var i = 0; i < rooms.length; i++) {
        if (bool) {
          break;
        } else if (rooms[i].devices.alarm[0] == id) {
          var notif = new Notification({
            type: alarm.data,
            content: alarm.data + " detected",
            time: new Date().toString().substring(0, 24),
            userId: user._id,
            a: {
              val: true,
              id: id,
              nameRoom: rooms[i].name
            }
          });
          pusher.trigger("inserted", "alarm", {
            //TODO to add //data : change.fullDocument.data
            message:
              alarm.data +
              " detected on the room : " +
              rooms[i].name +
              ", would you like to stop it ?",
            id: alarm._id,
            elm: notif._id
          });
          await notif.save();
          bool = true;
        }
      }

      await user.save();
    }
  });
});

app.use(express.static("views"));
app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get(
  "/home",
  //, csrfProtection
  function(req, res) {
    res.render("index");
  }
);

app.use("/api/auth", auth);
app.use("/api/signIn", signIn);
app.use("/api/forgot", forgot);
app.use("/reset", reset);
app.use("/api/rooms", rooms);
app.use("/api/notifications", notifications);
