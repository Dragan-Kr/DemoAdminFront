//7:44

const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenthicatedError,
} = require("../controller/errors");

// const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // const {name,email,password} = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password,salt);

  // const tempUser = {name,email,password:hashedPassword};
  // if(!name || !email || !password){//izbacuje gresku(ugradjenu) i bez ovoga jer su polja neophodna
  //    throw new BadRequestError('Please provide name,email and password');
  // }
  try {
    const { userName, email, password } = req.body;

    // Check if the username already exists in the database
    const existingUserByUserName = await User.findOne({ userName });
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByUserName) {
      // Handle the error condition (username is already taken)
      // For example, send an error response to the client
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username is already taken.' });
    }
    if (existingUserByEmail) {
      // Handle the error condition (username is already taken)
      // For example, send an error response to the client
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is already taken.' });
    }

    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    // const user = await User.create().apply(null,tempUser);
  
    // const token = jwt.sign({userId:user._id,name:user.name},'jwtSecret',{expiresIn:'30d'});//_id je atribut u moongodb
    res
      .status(StatusCodes.CREATED)
      .json({ user: { userName: user.userName }, token });
  } catch (error) {
    console.log(error)
  }
 
};

const login = async (req, res) => {
  try {
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
    res
      .status(StatusCodes.OK)
      .json({ user: { userName: user.userName }, token });
  } catch (error) {
    console.error("Login failed:", error);
    // if (error instanceof BadRequestError) {
    //   res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    // } else if (error instanceof UnauthenticatedError) {
    //   res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    // } else {
    //   res
    //     .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //     .json({ error: "An error occurred during login." });
    // }
  }
};

module.exports = { register, login };
