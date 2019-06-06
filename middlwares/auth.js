<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 67b4868981c6f20d9c44fdf12dd04b9f8cf364bc
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  console.log(token);
  if (!token) return res.status(401).send("Access Denied ");
  else console.log("token s7i7");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.userId = decoded;
    console.log("req.userId :", req.userId);
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
};
<<<<<<< HEAD
=======
=======
const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = function (req,res,next) {
const token =  req.header('x-auth-token');
console.log(token);
if (!token) return res.status(401).send('Access Denied '); else console.log('token s7i7');

try{
const decoded = jwt.verify(token , config.get('jwtPrivateKey'));
 req.userId = decoded ;

next();


}
catch (ex){
    res.status(400).send('invalid token');

}

}

>>>>>>> 0fe3e8a79177b66b7fa3deb209991f57c405f0f1
>>>>>>> 67b4868981c6f20d9c44fdf12dd04b9f8cf364bc
