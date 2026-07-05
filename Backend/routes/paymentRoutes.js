import express, { Router } from "express";
import {
  createPayment,
  uploadScreenshot,
  verifyPayment,
  getUserPayments,
  getAllPayments,
  getPaymentById
} from '../controllers/paymentController.js';
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

//user routes
router.post('/', protect, createPayment);
router.get('/my-payments', protect, getUserPayments);
router.post('/:id/screenshot', protect, upload.single('screenshot'), uploadScreenshot);

//admin routes
router.get('/', protect, adminOnly, getAllPayments);
router.put('/', protect, adminOnly, verifyPayment);

export default router;

