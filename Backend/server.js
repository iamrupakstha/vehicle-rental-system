import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
// database connection
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';

import vehicleRoutes from './routes/vehicleRoutes.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


//authentication (users)
app.use('/api/auth', authRoutes);

//vehicles
app.use('/api/vehicles', vehicleRoutes);

// image of vehicles
app.use('/uploads', express.static('uploads'));

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




