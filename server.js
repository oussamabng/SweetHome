const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const signIn = require('./routes/signIn'); 
const forgot = require('./routes/forgot');
var bodyParser = require('body-parser');
const reset = require('./routes/reset');
const rooms = require('./routes/rooms');









app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');




if (!config.get('jwtPrivateKey')) {
  console.log('fatal ERRoR');
process.exit(1);
}


// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});




mongoose.connect('mongodb://localhost/login', {
  useCreateIndex: true,
  useNewUrlParser: true
})
.then(()=> console.log('connected to mongodb'))
.catch((err)=> console.error(`could not connect`));

app.use(express.static('views'));
app.get('/', function (req, res) {
  
  res.render('webapp');
});






app.use('/api/auth' , auth);
app.use('/api/signIn', signIn);
app.use('/api/forgot', forgot);
app.use('/reset' , reset);
app.use('/api/rooms', rooms);







app.post('/server', function(req,res){


  let str = "ok";
    str = req.body['name'];
   const result = str.toUpperCase();

	res.status(200).send({name: result});



	res.status(200).send({name: req.body['name']});


})

app.listen(3000 , function(){
console.log('listening...');
});