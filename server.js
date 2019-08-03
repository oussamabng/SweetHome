const express = require("express");
const app = express();
const webPush = require("web-push");
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

  const alarmCollection = db.collection("alarms");
  const changeStream = alarmCollection.watch();

  changeStream.on("change", change => {
    if (
      change.operationType === "replace" &&
      change.fullDocument.value == true
    ) {
      console.log("alarm tsoniii !!!!!!!");
      pusher.trigger("alarms", "inserted", {
        message: "hello world",
        id: change.fullDocument._id
      });
    }
  });
});

app.use(express.static("views"));
app.get(
  "/",
  //, csrfProtection
  function(req, res) {
    console.log(req.csrfToken);
    res.render(
      "webapp"

      //,{ csrfToken: req.csrfToken() }
    );
  }
);
app.use("/api/auth", auth);
app.use("/api/signIn", signIn);
app.use("/api/forgot", forgot);

app.use("/reset", reset);
app.use("/api/rooms", rooms);
app.use("/api/notifications", notifications);

app.post("/server", function(req, res) {
  let str = "ok";
  str = req.body["name"];
  const result = str.toUpperCase();

  res.status(200).send({ name: result });

  res.status(200).send({ name: req.body["name"] });
});
