//7:44
const express = require("express");

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenthicatedError,
} = require("../controller/errors");
// const emailValidator = require('deep-email-validator');
// const bcrypt = require('bcryptjs');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { userName: "", email: "", password: "" };
  // console.log("PATH",err.errors)

  if (err.code === 11000) {
    console.log("USAOOO");
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log("properties", properties);
      errors[properties.path] = properties.message;
    });
  }
  // console.log("handleErrors->errors",errors)
  return errors;
};

const register = async (req, res) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res
        .status(415)
        .json({
          message: "Unsupported Media Type: Only application/json is allowed.",
        });
    }


    console.log("Register->req.body", req.body);

    const { userName, email, password } = req.body;
    console.log("userName,email,password", userName, email, password);

  //  await validateEmail(email);

    const user = await User.create({ userName, email, password });
    if (user) {
      const token = user.createJWT();
      res
        .status(StatusCodes.CREATED)
        .json({ user: { userName: user.userName } });
    }
  } catch (error) {
    const errors = handleErrors(error);
    //  return res.status(StatusCodes.BAD_REQUEST).json({ message: "Registration failed." });
    return res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
  }
};



const login = async (req, res) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res
        .status(415)
        .json({
          message: "Unsupported Media Type: Only application/json is allowed.",
        });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
  
    const user = await User.findOne({ email });
console.log("LogIn->User",user)
    if (!user) {
      throw new UnauthenthicatedError("Invalid Credentials");
    }

    
    // const isPasswordCorrect = await user.comparePassword(password);


    // if (isPasswordCorrect===false) {
    //   throw new UnauthenthicatedError("Invalid password");
    // }

  


    // const token = user.createJWT();
    const accessToken = jwt.sign(
      {
          "UserInfo": {
              "username": user.username,
              "roles": user.roles,
              "email":user.email
          }
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
  );


  const refreshToken = jwt.sign(
      { userId: this._id, userName: this.userName },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_LIFETIME }
  );

    user.refreshToken = refreshToken;

    
    await user.save();
    const tokenCookieValue = `${accessToken}.${refreshToken}`; 

    res.cookie("jwt", tokenCookieValue, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({ user: { userName: user.userName }, accessToken });

  } catch (error) {
    console.log("Login error", error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }
};

const logout = async (req, res) => {
  try {
        const cookies = req.body[1];
        console.log("Logout->cookies",cookies)

        console.log("Logout->req.body[1]",req.body[1])
        const email = req.body[0];

    if (!cookies?.jwt){
      throw new BadRequestError("No jwt in cookie");
     //No content
    }
    // const refreshToken = cookies.jwt;


    const user = await User.findOne({ email });
    

    if (!user) {
      return res.sendStatus(204);
    }

    user.refreshToken = "";
    await user.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.status(StatusCodes.OK).json({ message: "Logout successful" });


  } catch (error) {
    console.error("Logout failed:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error });
  }
};



module.exports = { register, login, logout };
