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

