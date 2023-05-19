//7:54


// const User = require('../../models/User');
const User = require('../model/Writer');

const jwt = require('jsonwebtoken');
const {UnauthenthicatedError} = require('../../errors');

const auth = async (req,res,next) =>{
//check header
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenthicatedError('Authentication invalid');
}
const token = authHeader.split(' ')[1];
try {
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    //attach user to job routes
    const user = User.findById(payload.id).select('-password');
    req.user =  user;
    req.user = {userId:payload.userId,name:payload.name};
next();
} catch (error) {
    throw new UnauthenthicatedError('Authentication invalid');
}
};
module.exports = auth;