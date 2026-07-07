import User from '../models/User.js';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register User
export const registerUser = async (req, res) => {
  try {
    const {name, email, password, phone, role} = req.body;

    const userExists = await User.findOne({email});
    if(userExists) {
      return res.status(400).json({message: "User already exists!"});
    }
    // hash value of password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "customer",
    });

    //generate JWT token
    const token = jwt.sign(
      {userId: user._id, role: user.role}.process.env.JWT_SECRET,
      {expiresIn: '7d'}
    );

    //send response
    res.status(201).json({
      message: "Register successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch(error) {
    res.status(500).json({message: error.message});
  }
}

// User login
export const loginUser = async (req, res) => {
  try{
    const {email, password} = req.body;

    // Check user
    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    // generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET, 
      {expiresIn: '7d'}
    );

    res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

//current user me
export const currentUser = async(req, res) => {
  try {
        
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

