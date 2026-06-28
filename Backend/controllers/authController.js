import User from '../models/User.js';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register User
export const registerUser = async (req, res) => {
  try {
    const {name, email, password, phone} = req.body;

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
      phone
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        name: user._name,
        email: user._email,
        role: user._role
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
      return res.status(400).json({message: "Invalid email or password"});
    }

    // Check provider
    if(user.authProvider === 'google') {
      return res.status(400).json({message: "please login with google"});
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({message: 'Invalid password'});
    }

    // generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user._role,
      },
      process.env.JWT_SECRET, 
      {expiresIn: '7d'}
    );

    res.status(200).json({
      message: 'Login Successful!',
      token,
      user: {
        id: user._id,
        name: user._name,
        email: user._email,
        role: user._role
      }
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

