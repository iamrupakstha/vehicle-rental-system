import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js';
const router = express.Router();

import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);

// test routes
// protected route
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'User profile accessed!',
  user: req.user
  });
});
// admin only
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({
    Message: 'Welcome Admin'
  });
});

export default router;