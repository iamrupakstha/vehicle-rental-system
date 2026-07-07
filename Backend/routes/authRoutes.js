import express from 'express';
import {registerUser, loginUser, currentUser} from '../controllers/authController.js';
const router = express.Router();

import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', currentUser);


export default router;