import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// database connection
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';

import vehicleRoutes from './routes/vehicleRoutes.js';

import bookingRoutes from './routes/bookingRoutes.js'

import adminRoutes from './routes/adminRoutes.js'

import { startBookingScheduler } from './services/bookingScheduler.js';



dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// image of vehicles
app.use('/uploads', express.static('uploads'));
//automatically update status of vehicle and booking
startBookingScheduler();
//Use Routes
//authentication (users)
app.use('/api/auth', authRoutes);

//vehicles
app.use('/api/vehicles', vehicleRoutes);

//bookings
app.use('/api/bookings', bookingRoutes);

//admin overviews
app.use('/admin', adminRoutes)




app.get('/', (req, res) => {
  res.send("API is running");
})


const PORT = process.env.PORT || 5000;
const startServer = async() => {
  await connectDB();

  app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})
};

startServer();




