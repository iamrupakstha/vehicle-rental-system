import express from 'express';

import { 
  createVehicle, 
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
  addReview,
  getVehicleReviews,
  deleteReview
 } from '../controllers/vehicleController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
//public
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);

//admin only
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);
router.get('/stats/overview', protect, adminOnly, getVehicleStats);

//review by authenticated user
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews', protect, deleteReview);




export default router;