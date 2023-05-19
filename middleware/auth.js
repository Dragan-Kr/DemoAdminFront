const jwt = require('jsonwebtoken');
const {UnauthenthicatedError} = require('../controller/errors');


const authentificationMiddleware = async(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenthicatedError('No token provided');//authentification error
    }
    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        // const luckyNumber = Math.floor(Math.random() * 100);
        // res.status(200).json({msg:`Hello ${decoded.username}`,secret:`Here is your authorized data,your lucky number is ${luckyNumber}`});
        const {id,username} = decoded;
        req.user = {id,username};
        next();


    } catch (error) {
        throw new UnauthenthicatedError('Not authorized to access this route');
    }
console.log(req.headers.authorization);
};

module.exports = authentificationMiddleware;