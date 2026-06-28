import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protected route
export const protect = async (req, res, next) => {
  let token;

  if(
    req.headers.authorization &&  // Header exists
    req.headers.authorization.startsWith('Bearer') //correct token format
  ) {
    try {
      // verify token
      token = req.verify(token, process.env.JWT_SECRET);

      // get user (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({message: 'Not authorized, token failed!'});
    }
  }
  if(!token) {
    return res.status(401).json({message: "Not authorized, no token"})
  }
}

// Admin only
export const adminOnly = (req, res, next) => {
  if(req.user & req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({message: 'Admin access only'});
  }
}