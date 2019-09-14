const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const store = require("store");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5
  },
  resetPasswordToken: { type: String, default: "" },

  resetPasswordExpires: { type: Date, default: Date.now() },
  tokenId: String,
  check: { type: Boolean, default: true }
});

const roomsSchema = {
  name: { type: String, default: "", unique: true },
  userId: { type: String },
  typeRoom: {
    type: String,
    enum: ["kitchen", "hallway", "livingRoom", "bedroom", "office"]
  },
  devices: {
    dht: [{ type: String, default: "bilama id " }],
    rgb: [{ type: String, default: "bilama id " }],
    ultrason: [{ type: String, default: "bilama id " }],
    alarm: [{ type: String, default: "bilama id " }],
    gsense: [{ type: String, default: "bilama id " }],
    light: [{ type: String, default: "bilama id " }]
  }
};

// Devices collection

const DHTSchema = new mongoose.Schema({
  name: String,
  value: {
    temperature: { type: [Number] },
    humidity: { type: [Number] },
    time: { type: [Number] }
  },
  used: { type: Boolean, default: false },
  tokenId: String
});

alarmSchema = new mongoose.Schema({
  name: String,
  data: {
    type: String,
    enum: ["motion", "temperature", "gaz", "ultrason"],
    default: "motion"
  },
  value: { type: Boolean, default: false },
  used: { type: Boolean, default: false },
  tokenId: String,
  type: { type: String, enum: ["auto", "man"], default: "auto" }
});

GSenseSchema = new mongoose.Schema({
  name: String,
  used: { type: Boolean, default: false },
  tokenId: String,

  value: {
    smoke: { type: [Number] },
    lpg: { type: [Number] },
    methane: { type: [Number] },
    propane: { type: [Number] },
    time: { type: [Number] }
  }
});

const RGBSchema = new mongoose.Schema({
  name: String,
  state: { type: Boolean, default: false },
  color: { type: String },
  used: { type: Boolean, default: false },
  tokenId: String
});

const UltrasonSchema = new mongoose.Schema({
  name: String,
  value: { type: Boolean, default: false },
  used: { type: Boolean, default: false },
  tokenId: String
});

const LightSchema = new mongoose.Schema({
  name: String,
  value: { type: Boolean, default: false },
  used: { type: Boolean, default: false },
  tokenId: String
});

const ScenarioSchema = new mongoose.Schema({
  name: { type: String },
  checked: { type: Boolean },
  color: { type: String },
  rooms: { type: [String] },
  userId: { type: String },
  time: { type: String, default: "" },
  repeat: { type: String, default: "" },
  update: { type: Boolean, default: false },
  devicesOn: {
    rgb: { type: Boolean },
    dht: { type: Boolean },
    light: { type: Boolean },
    ultrason: { type: Boolean },
    gsense: { type: Boolean },
    alarm: { type: Boolean }
  },
  devicesOff: {
    rgb: { type: Boolean },
    dht: { type: Boolean },
    light: { type: Boolean },
    ultrason: { type: Boolean },
    gsense: { type: Boolean },
    alarm: { type: Boolean }
  }
});

const ArmingModeSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: Boolean, default: false },
  tokenId: { type: String }
});

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["motion", "temperature", "gaz", "ultrason"] },
  content: { type: String },
  time: { type: String },
  userId: { type: String },
  a: {
    val: { type: Boolean, default: false },
    id: { type: String },
    nameRoom: { type: String }
  }
});
const ArmingMode = mongoose.model("armingmodes", ArmingModeSchema);
const Notification = mongoose.model("notifications", NotificationSchema);
const Scenario = mongoose.model("scenarios", ScenarioSchema);
const User = mongoose.model("users", userSchema);
const Dht = mongoose.model("dhts", DHTSchema);
const Light = mongoose.model("lights", LightSchema);
const Alarm = mongoose.model("alarms", alarmSchema);
const Rgb = mongoose.model("rgbs", RGBSchema);
const Gsense = mongoose.model("gsenses", GSenseSchema);
const Ultrason = mongoose.model("ultrasons", UltrasonSchema);
const Rooms = mongoose.model("rooms", roomsSchema);

userSchema.methods.genAuthTok = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

function validate(user) {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}
module.exports.ArmingMode = ArmingMode;
module.exports.Notification = Notification;
module.exports.Scenario = Scenario;
module.exports.User = User;
module.exports.validate = validate;
module.exports.Dht = Dht;
module.exports.Light = Light;
module.exports.Rgb = Rgb;
module.exports.Ultrason = Ultrason;
module.exports.Alarm = Alarm;
module.exports.Gsense = Gsense;
module.exports.Rooms = Rooms;
