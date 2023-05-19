//5:49

//kako testirati logovanje je na 5:49 ->https://www.youtube.com/watch?v=qwfE7fSVaZM
const jwt = require('jsonwebtoken');

const {BadRequestError} = require('../controller/errors');

const login = async (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
        
        throw new BadRequestError('Please provide email and password');

    }
    console.log(username,password);
    
    const id = new Date().getDate();//obicno se salje id username-a iz baze ali ovdje je napravljen vjestacki jer se u datom videu(dijelu videa) nije povezao sa bazom
    const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'30d'});


    res.status(200).json({msg:'user created',token});
};

const dashboard = async (req,res)=>{
    // const authHeader = req.headers.authorization;

    // if(!authHeader || !authHeader.startsWith('Bearer ')){
    //     throw new CustomApiError('No token provided',401);//authentification error
    // }
    // const token = authHeader.split(' ')[1];//uzima odrugi dio koji je prosledjen u Headers(Authorization) u GetDashboard zahtjevu u postmanu
    // console.log(token);
    // try {
    //     const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //     console.log(decoded);
    //     const luckyNumber = Math.floor(Math.random() * 100);
    //     res.status(200).json({msg:`Hello ${decoded.username}`,secret:`Here is your authorized data,your lucky number is ${luckyNumber}`});
    // } catch (error) {
    //     throw new CustomApiError('Not authorized to access this route',401);
    // }

    console.log(req.user);
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({msg:`Hello ${req.user.username}`,secret:`Here is your authorized data,your lucky number is ${luckyNumber}`});
};
module.exports = {
    login,dashboard
};