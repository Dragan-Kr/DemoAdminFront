//7:44

const User = require('../model/Writer')
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenthicatedError} = require('../controller/errors');


// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const register = async (req,res)=>{
    // const {name,email,password} = req.body;

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password,salt);

    // const tempUser = {name,email,password:hashedPassword};
    // if(!name || !email || !password){//izbacuje gresku(ugradjenu) i bez ovoga jer su polja neophodna
    //    throw new BadRequestError('Please provide name,email and password');
    // }
    const user = await User.create({...req.body });
    const token = user.createJWT();
    // const user = await User.create().apply(null,tempUser);

    
    // const token = jwt.sign({userId:user._id,name:user.name},'jwtSecret',{expiresIn:'30d'});//_id je atribut u moongodb
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
};

const login = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    if(!user){
        throw new UnauthenthicatedError('Invalid Credentials');
    }
    //compare password

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenthicatedError('Invalid Credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});

};

module.exports={register,login};