const express = require("express");
const app = express();
const webPush = require("web-push");
const jwt = require("jsonwebtoken");
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
//const cookieParser = require("cookie-parser");

//ok

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
  const changeStream = alarmCollection.watch();
  const changeStreamUltrason = utrasonCollection.watch();

  changeStreamUltrason.on("change", async function(change) {
    if (change.operationType === "replace") {
      const user = await User.findOne({ tokenId: change.fullDocument.tokenId });
      var room = await Rooms.find({ userId: user._id });
      room.forEach(async function(elm) {
        if (elm.devices.ultrason[0] == change.fullDocument._id) {
          console.log({
            id: change.fullDocument._id,
            name: elm.name,
            value: change.fullDocument.value
          });
          pusher.trigger("inserted", "ultrason", {
            //TODO to add //data : change.fullDocument.data
            id: change.fullDocument._id,
            name: elm.name,
            value: change.fullDocument.value
          });
          notif = new Notification({
            type: "ultrason",
            content: "door action happend",
            time: new Date().toString().substring(0, 24),
            userId: user._id,
            a: {
              val: true,
              id: change.fullDocument._id,
              nameRoom: elm.name
            }
          });
          await notif.save();
        }
      });
    }
  });

  changeStream.on("change", async function(change) {
    if (
      change.operationType === "replace" &&
      change.fullDocument.value == true
    ) {
      var user = await User.findOne({ tokenId: change.fullDocument.tokenId });
      user.check = false;
      var rooms = await Rooms.find({ userId: user._id });
      rooms.forEach(async function(room) {
        if (room.devices.alarm[0] == change.fullDocument._id) {
          var notif = new Notification({
            type: change.fullDocument.data,
            content: change.fullDocument.data + " detected",
            time: new Date().toString().substring(0, 24),
            userId: user._id,
            a: {
              val: true,
              id: change.fullDocument._id,
              nameRoom: room.name
            }
          });
          pusher.trigger("inserted", "alarm", {
            //TODO to add //data : change.fullDocument.data
            message:
              change.fullDocument.data +
              " detected on the room : " +
              room.name +
              ", would you like to stop it ?",
            id: change.fullDocument._id,
            elm: notif._id
          });
          await notif.save();
        }
      });

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
