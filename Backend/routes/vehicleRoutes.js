import express from 'express';

import { 
  createVehicle, 
  getVehicles,
  updateVehicle,
  deleteVehicle
 } from '../controllers/vehicleController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
//public
router.get('/', getVehicles);

//admin
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);


export default router;