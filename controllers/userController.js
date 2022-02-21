const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc Register new User
//@ route POST api/user
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  // console.log(req.body);

  if (!name ||!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // Check if user exits first
  const userExists = await User.findOne({email})

  if(userExists){
    res.status(400)
    throw new Error("User Already Exists")
  }

  //Hash password 
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashPassword
  })

  if(user){
    res.status(201).json({
      _id: user.id, 
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    }, 
    // {
    //   message: 'User Created'
    // }
  )
  }else{
    res.status(400)
    throw new Error('Invalid user data')
  }
});

//@desc Authenticate a User
//@ route POST api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //Check for user email
  const user = await User.findOne({email})

  if (user && (await bcrypt.compare(password, user.password))){
    res.json({
      _id: user.id, 
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    }, 
    // {
    //   message: "User Logged In"
    // }
  )
  }else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }
  
});

//@desc Get User Data
//@ route POST api/goals
//@access Private

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)

  // const {_id, name, email} = await User.findById(req.user.id)
  // res.status(200).json({ 
  //   id: _id,
  //   name,
  //   email
  // })
});

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "10d",
  })
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
