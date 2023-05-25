//7:44

const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenthicatedError,
} = require("../controller/errors");



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
    res
      .status(StatusCodes.OK)
      .json({ user: { userName: user.userName }, token });
  } catch (error) {
    console.error("Login failed:", error);
  }
};


// async function isEmailValid(email) {
//   return emailValidator.validate(email)
// }

function validateEmail(email) {
  // Regular expression to check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email matches the regex pattern
  if (!emailRegex.test(email)) {
    return false; // Invalid email format
  }

  // Split the email address to get the domain part
  const [localPart, domainPart] = email.split('@');

  // Perform additional checks on the domain
  if (domainPart) {
    // Check if domain has a valid format
    const domainRegex = /^[^\s@]+\.[^\s@]+$/;
    if (!domainRegex.test(domainPart)) {
      return false; // Invalid domain format
    }

    // Check if domain has a valid MX record (optional)
    const dns = require('dns');
    return new Promise((resolve, reject) => {
      dns.resolveMx(domainPart, (error, addresses) => {
        if (error || addresses.length === 0) {
          resolve(false); // MX record not found or error occurred
        } else {
          resolve(true); // Valid email address
        }
      });
    });
  }

  return false; // Invalid email format (no domain part)
}

module.exports = { register, login };
