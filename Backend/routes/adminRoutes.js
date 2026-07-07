import express, { Router } from "express";
import {
  getDashboardStats,
  getRevenueReport,

  //users
  getAllUsers,

  //vehicles
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
  getVehicleReviews,

  //bookings
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  //payments
  getAllPayments,
  verifyBookingPayment,
  getPaymentStats

} from '../controllers/adminController.js';
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, adminOnly)

//Dashboards
router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/revenue', getRevenueReport);

//users management
router.get('/users', getAllUsers )


//vehicles management
router.post('/create-vehicles', createVehicle)
router.get('vehicles', getAllVehicles);
router.put('/vehicles/:id/update', updateVehicle);
router.delete('/vehicles/:id/delete', deleteVehicle);
router.get('/vehicles/stats', getVehicleStats);
router.get('/vehicles/:id/reviews', getVehicleReviews)

//bookings managment
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

//payments management
router.get('/payments', getAllPayments);
router.put('/payments/:id/verify', verifyBookingPayment);
router.get('/payments/stats', getPaymentStats);


export default router;

