import epress from "express";
import { 
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats
  } from "../controllers/bookingController.js";
  import { protect, adminOnly } from "../middleware/authMiddleware.js";

  const router = epress.Router();

  //create booking

  //users
  router.post('/', protect, createBooking);
  router.get('/my-bookings', protect, getMyBookings);
  router.get('/:id',protect, getBookingById);
  router.put('/:id/cancel',protect, cancelBooking);


  //admin only
  router.get('/', protect, adminOnly, getAllBookings);
  router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.get('/stats/overview', protect, adminOnly, getBookingStats);

  export default router;
  