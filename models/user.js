const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({

username : {
    type : String,
    required : true , 
    maxlength : 50 ,
    minlength : 5
},
email :  {
    type : String ,
    required : true,
    unique : true 
} , 
password : {
    type :String , 
    required : true ,
    maxlength : 255 , 
    minlength : 5
}
,
resetPasswordToken : {type :String , default :""} , 

resetPasswordExpires :{type : Date , default : Date.now()}, 
tokenId : String

});



const roomsSchema = {
    name : { type : String , default : ""} ,
    userId : {type :String},
typeRoom : {type : String , enum : ["kitchen","hallway","livingRoom","bedroom" , "office" ]},
devices : {
    dht : [{type : String , default : "bilama id "}],
    rgb : [{type : String , default : "bilama id "}],
    ultrason : [{type : String , default : "bilama id "}],
    alarm : [{type : String , default : "bilama id "}],
    gsense : [{type : String , default : "bilama id "}],
    light : [{type : String , default : "bilama id "}]

}
}


// Devices collection 





    const DHTSchema = new mongoose.Schema({
        name : String,
        value : {type : [Number]},
        used : {type : Boolean, default : false},
        tokenId : String
   });
    
    alarmSchema = new mongoose.Schema({
name : String,
value : {type : Boolean, default : false},
used : {type : Boolean, default : false},
tokenId : String
    });



GSenseSchema = new mongoose.Schema({
name : String , 
used : {type : Boolean, default : false},
tokenId : String,

value :  [
    
    [{
        smoke : {type : [Number]} , 
        lpg : {type : [Number]} , 
        methane : {type : [Number]},
        propane : {type : [Number]}
    }]  


   
]
});

const RGBSchema = new mongoose.Schema({
name : String,
state:  {type : [Number]},
color : {type : [Number]},
used : {type : Boolean, default : false},
tokenId : String

});

    const UltrasonSchema = new mongoose.Schema({
name : String , 
value : {type : Boolean, default : false},
used : {type : Boolean, default : false},
tokenId : String

    });

    const LightSchema = new mongoose.Schema({
     name : String,
     value : {type : Boolean, default : false},
     used : {type : Boolean, default : false},  
     tokenId : String

    });
 

const User = mongoose.model('users', userSchema);
const Dht = mongoose.model('dhts', DHTSchema);
const Light = mongoose.model('lights' , LightSchema);
const Alarm = mongoose.model('alarms' , alarmSchema);
const Rgb = mongoose.model('rgbs' , RGBSchema);
const Gsense = mongoose.model('gsenses' , GSenseSchema);
const Ultrason = mongoose.model('ultrasons' , UltrasonSchema);
const Rooms = mongoose.model('rooms' , roomsSchema);








userSchema.methods.genAuthTok = function(){
const token = jwt.sign({_id : this._id} , config.get('jwtPrivateKey'));
return token;
}

function validate(user){
   const schema = {
      username :Joi.string().min(5).max(50).required(),
      email : Joi.string().email().required(),
      password: Joi.string().min(5).max(255).required()
     
    }
return Joi.validate(user , schema);

}

module.exports.User = User ; 
module.exports.validate = validate ; 
module.exports.Dht = Dht;
module.exports.Light = Light;
module.exports.Rgb = Rgb;
module.exports.Ultrason = Ultrason;
module.exports.Alarm = Alarm;
module.exports.Gsense = Gsense;
module.exports.Rooms = Rooms;