import express from 'express';
import {registerUser, loginUser, currentUser,getAllUsers } from '../controllers/authController.js';
const router = express.Router();

import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', currentUser);
router.get('/users', protect, adminOnly, getAllUsers )


export default router;