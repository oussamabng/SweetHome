<<<<<<< HEAD
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
router.post("/", auth, async function(req, res) {
  const user = await User.findOne({ _id: req.userId });
  let room = new Rooms({
    name: req.body.name,
    userId: req.userId,
    typeRoom: req.body.typeRoom,
    devices: {
      dht: [],
      rgb: [],
      ultrason: [],
      alarm: [],
      gsense: [],
      light: []
    }
  });
  // tableau li rslthoulak te3 Devices bsh ykoun user mkhyr manah li bgha ykhdem bihom
  let arrDevices = req.body.arrDevices;
  console.log(arrDevices);
  arrDevices.dhts.forEach(element => {
    room.devices.dht.push(element._id);
  });

  arrDevices.alarms.forEach(element => {
    room.devices.alarm.push(element._id);
  });

  arrDevices.lights.forEach(element => {
    room.devices.light.push(element._id);
  });

  arrDevices.rgbs.forEach(element => {
    room.devices.rgb.push(element._id);
  });

  arrDevices.gsenses.forEach(element => {
    room.devices.gsense.push(element._id);
  });

  arrDevices.ultrasons.forEach(element => {
    room.devices.ultrason.push(element._id);
  });

  await room.save();
  await user.save();
  res.send("room added succesfuly"); //anglais mkwd laghlb
});

// ********************************************************//
//*****************************************************//

// get rooms
router.get("/", auth, async function(req, res) {
  //console.log(req.userId);
  const rooms = await Rooms.find();
  console.log(rooms);
  res.send(rooms);
});

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
=======
const express = require('express');
const router = express.Router();
const auth = require('../middlwares/auth');
const {User , Dht , Light , Alarm , Rgb , Gsense , Ultrason , Rooms}= require('../models/user');
const _ = require('lodash');





 // ********************************************************// 
 //*****************************************************//
//add room
router.post('/' ,auth,  async function(req, res){
const user = await User.findOne({ _id : req.userId});
let room = new Rooms({
name : req.body.name,
userId : req.userId,
typeRoom : req.body.typeRoom,
devices : {
  dht : [],
  rgb : [],
  ultrason : [],
  alarm : [],
  gsense : [],
  light : []

}
});
// tableau li rslthoulak te3 Devices bsh ykoun user mkhyr manah li bgha ykhdem bihom
let arrDevices = req.body.arrDevices;
console.log(arrDevices);
arrDevices.dhts.forEach(element => {
  room.devices.dht.push(element._id) ;
});

arrDevices.alarms.forEach(element => {
  room.devices.alarm.push(element._id) ;
  });
  
arrDevices.lights.forEach(element => {
  room.devices.light.push(element._id) ;
  });
  
   
arrDevices.rgbs.forEach(element => {
   room.devices.rgb.push(element._id) ;
  });
  
arrDevices.gsenses.forEach(element => {
 room.devices.gsense.push(element._id) ;
  });
  
arrDevices.ultrasons.forEach(element => {
room.devices.ultrason.push(element._id) ;
  });
  
await room.save()      
await user.save()
res.send("room added succesfuly") //anglais mkwd laghlb 
});

 // ********************************************************// 
 //*****************************************************//




 // get rooms 
router.get('/' , auth , async function(req,res) {
const rooms = await Rooms.find({ userId : req.userId });
console.log(rooms);
res.send(rooms);
});

 // ********************************************************// 
 //*****************************************************//



 //get devices te3 kol room
 router.get('/devices/:id'  , async function(req,res){
  const room = await Rooms.find({ _id : req.params.id });

  let dev = []
    dev.dhts = []
    dev.alarms = []
    dev.ultrasons = []
    dev.rgbs = []
    dev.gsenses = []
    dev.lights = []

    room.dht.forEach(async function(element) {
      let temp = await Dht.findOne({_id : element});
      dev.dhts.push(temp);
    });

    room.alarm.forEach(async function(element){
      let temp = await Alarm.findOne({_id : element});
      dev.alarms.push(temp);
    });
    room.ultrason.forEach(async function(element){
      let temp = await Ultrason.findOne({_id : element});
      dev.ultrasons.push(temp);
    });
    room.rgb.forEach(async function(element){
      let temp = await Rgb.findOne({_id : element});
      dev.rgbs.push(temp);
    });
    room.light.forEach(async function(element){
      let temp = await Light.findOne({_id : element});
      dev.lights.push(temp);
    });
    room.gsense.forEach(async function(element){
      let temp = await Gsense.findOne({_id : element});
      dev.gsenses.push(temp);
    });

res.send(dev , function(){
  console.log('devices getted');
});


 });


//get devices for add room
router.get('/devices' ,auth, async function(req,res){
    let dev = {
      "dhts" : [],
      "alarms" : [],
      "ultrasons" : [],
      "rgbs" : [],
      "gsenses" : [],
      "lights" : []
    }
    



     
    const user = await User.find({ _id : req.userId});
    const dht = await Dht.find({tokenId : user[0].tokenId });
   const light = await Light.find({tokenId : user[0].tokenId});
   const ultrason = await Ultrason.find({tokenId : user[0].tokenId });
    const alarm = await Alarm.find({tokenId : user[0].tokenId });
    const rgb = await Rgb.find({tokenId : user[0].tokenId });
    const gsense = await Gsense.find({tokenId : user[0].tokenId });
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
 router.put('/:id'  ,  async function(req,res){
  //const user = await User.findOne({ _id : req.userId});*
  console.log(req.params.id);
  const room = await Rooms.findOne({_id :req.params.id});
>>>>>>> 0fe3e8a79177b66b7fa3deb209991f57c405f0f1
  console.log(room);
  room.name = req.body.name;
  room.typeRoom = req.body.typeRoom;
  const result = await room.save();
  console.log(result);
<<<<<<< HEAD
  res.send(result);
});

//delete room
router.delete("/:id", async function(req, res) {
  const room = await Rooms.deleteOne({ _id: req.params.id });
  res.send(room);
});

module.exports = router;
=======
 res.send(result); 
 }); 

//delete room
 router.delete('/:id' ,async function(req,res){
const room = await Rooms.deleteOne({_id : req.params.id});
res.send(room);
 });

module.exports = router; 


>>>>>>> 0fe3e8a79177b66b7fa3deb209991f57c405f0f1
