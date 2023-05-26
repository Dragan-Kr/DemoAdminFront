//7:44
const express = require('express');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenthicatedError,
} = require("../controller/errors");


app.use(cookieParser());

const handleErrors = (err) => {

  console.log(err.message, err.code);
  let errors = {userName:'', email: '', password: '' };
// console.log("PATH",err.errors)

  if (err.code === 11000) {
    console.log("USAOOO")
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
     console.log("properties",properties)
      errors[properties.path] = properties.message;
    });
  }
// console.log("handleErrors->errors",errors)
  return errors;
}




const register = async (req, res) => {
  
  try {

    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({ message: 'Unsupported Media Type: Only application/json is allowed.' });
    }


    const { userName, email, password } = req.body;
    console.log("userName,email,password",userName,email,password)
    // if (!userName || userName.length < 2 || userName.length > 50) {
    //   return res.status(400).json({ message: 'Please provide a valid userName (between 2 and 50 characters).' });
    // }


    // if (!password || password.length < 2) {
    //   return res.status(400).json({ message: 'Please provide a valid password (minimum length of 2 characters).' });
    // }


  //   const {valid, reason, validators} = await isEmailValid(email);
  //   if (!valid) {
  //     return res.status(400).send({
  //       message: "Please provide a valid email address.",
  //       reason: validators[reason].reason
  //     })
  // }


    
    
    // const existingUserByUserName = await User.findOne({ userName });
    // const existingUserByEmail = await User.findOne({ email });

    // if (existingUserByUserName) {
      
    //   return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username is already taken.' });
    // }
    // if (existingUserByEmail) {
      
    //   return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is already taken.' });
    // }

    const user = await User.create({ userName, email, password });
    if(user){
    const token = user.createJWT();
    res
      .status(StatusCodes.CREATED)
      .json({ user: { userName: user.userName }, token });
    }
  
  } catch (error) {
    

    const errors = handleErrors(error);
    //  return res.status(StatusCodes.BAD_REQUEST).json({ message: "Registration failed." });
    return res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
  }
  
};




const login = async (req, res) => {
  try {

    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({ message: 'Unsupported Media Type: Only application/json is allowed.' });
    }
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenthicatedError("Invalid Credentials");
    }
    //compare password

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenthicatedError("Invalid Credentials");
    }
    const token = user.createJWT();
    const refreshToken = jwt.sign({userId:this._id,userName:this.userName},process.env.REFRESH_JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

     res.status(StatusCodes.OK)
      .json({ user: { userName: user.userName }, token });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
  }
};




const logout = async (req, res) => {
  try {
    
    const cookies = req.cookies;
    console.log("LogOut->cookies",cookies)
    if (!cookies?.jwt)
     return res.sendStatus(204).json({ message: 'No coockie' }); //No content
     const refreshToken = cookies.jwt;
     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    console.log("Logout")

  } catch (error) {
    console.error('Logout failed:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
  }
};


// async function isEmailValid(email) {
//   return emailValidator.validate(email)
// }


module.exports = { register, login,logout };
