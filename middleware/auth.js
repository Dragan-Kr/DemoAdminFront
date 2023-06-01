const jwt = require('jsonwebtoken');
const {UnauthenthicatedError} = require('../controller/errors');


const authentificationMiddleware = async(req,res,next)=>{
    try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("authentificationMiddleware->authHeader",authHeader)

    if(!authHeader || !authHeader.startsWith('Bearer ')){
       
        throw new UnauthenthicatedError('No token provided');
    } 

    const token = authHeader.split(' ')[1];
    
    console.log(token);
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403); //invalid token
                req.user = decoded.UserInfo.username;
                req.roles = decoded.UserInfo.roles;
                next();
            }
        );
    } catch (error) {
        throw new UnauthenthicatedError('Not authorized to access this route');
    }

};

module.exports = authentificationMiddleware;

