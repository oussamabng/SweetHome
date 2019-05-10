const express = require('express');
const router = express.Router();
const {User , Alarm } = require('../models/user');
const config = require('config');

router.get('/' , function(req,res){

const changeStream = Alarm.watch( { readConcern: { level: "majority" } });


changeStream.on('change', (change) => {

    console.log("alarm changed : "+change); // You could parse out the needed info and send only that data. 
}); 
});
module.exports = router;