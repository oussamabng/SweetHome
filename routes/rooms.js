const express = require('express');
const router = express.Router();
const auth = require('../middlwares/auth');
const {User , Dht , Light , Alarm , Rgb , Gsense , Ultrason}= require('../models/user');
const _ = require('lodash');

//add room
router.post('/' ,auth,  async function(req, res){
let user = await User.findOne({ _id : req.userId});


//devices
let dht = await Dht.find({tokenId : "ouss"}); // a remplacer le token id // ghi bilama ni dyr ouss
let light = await Light.find({tokenId : "ouss"});
let alarm = await Alarm.find({tokenId : "ouss"});
let rgb = await Rgb.find({tokenId : "ouss"});
let gsense = await Gsense.find({tokenId : "ouss"});
let ultrason = await Ultrason.find({tokenId : "ouss"});

//name type 

user.rooms.name = req.body.name;
user.rooms.typeRoom = req.body.type;


dht.forEach(element => {
  user.rooms.devices.dht.push(element._id) ;
});

alarm.forEach(element => {
    user.rooms.devices.alarm.push(element._id) ;
  });
  
light.forEach(element => {
    user.rooms.devices.light.push(element._id) ;
  });
  
   
rgb.forEach(element => {
    user.rooms.devices.rgb.push(element._id) ;
  });
  
gsense.forEach(element => {
    user.rooms.devices.gsense.push(element._id) ;
  });
  
ultrason.forEach(element => {
    user.rooms.devices.ultrason.push(element._id) ;
  });
  
      
await user.save()
res.send("room added succesfuly") //anglais mkwd laghlb 
});



 // get rooms 

router.get('/' , auth , async function(req,res) {

const user = await User.find({ _id : req.userId});
res.send(_.pick(user.rooms,['name', 'typeRoom']), function(){
    console.log("rooms send succefully");
});

});

//get devices 

router.get('/devices' ,auth, async function(){
    let device =  []
    const user = await User.find({ _id : req.userId});


user.rooms.devices.dht.forEach(element => {
    device.push(Dht.findOne({_id : element}));
});

user.rooms.devices.light.forEach(element => {
    device.push(Light.findOne({_id : element}));
});

user.rooms.devices.rgb.forEach(element => {
    device.push(Rgb.findOne({_id : element}));
});

user.rooms.devices.alarm.forEach(element => {
    device.push(Alarm.findOne({_id : element}));
});

user.rooms.devices.gsense.forEach(element => {
    device.push(Gsense.findOne({_id : element}));
});

user.rooms.devices.ultrason.forEach(element => {
    device.push(Ultrason.findOne({_id : element}));
});


res.send(device); 
//send array of devices


});





module.exports = router; 