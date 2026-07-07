import express from 'express';

import { 
  getAllVehicles,
  getVehicleById,
  addReview,
  deleteReview
 } from '../controllers/vehicleController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
//public
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);

//review by authenticated user
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews', protect, deleteReview);




export default router;