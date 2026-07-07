import epress from "express";
import { 
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  uploadPaymentScreenshot
  
  } from "../controllers/bookingController.js";
  import { protect, adminOnly } from "../middleware/authMiddleware.js";
  import upload from '../middleware/upload.js';


  const router = epress.Router();

  //create booking

  //users
  router.post('/', protect, createBooking);
  router.get('/my-bookings', protect, getMyBookings);
  router.get('/:id',protect, getBookingById);
  router.put('/:id/cancel',protect, cancelBooking);

  //upload screenshot for online payment
  router.post('/:bookingId/screenshot', protect, upload.single('screenshot'), uploadPaymentScreenshot);


  export default router;
  