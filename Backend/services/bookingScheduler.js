import cron from 'node-cron';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

// CHECK AND UPDATE EXPIRED BOOKINGS
export const updateExpiredBookings = async () => {
  try {
    const now = new Date();
    console.log(`Running booking status check at ${now.toISOString()}`);

    // 1️⃣ Find all active bookings where endDate has passed
    const expiredBookings = await Booking.find({
      status: { $in: ['confirmed', 'active'] },
      endDate: { $lt: now }
    });

    if (expiredBookings.length === 0) {
      console.log('No expired bookings found');
      return;
    }

    console.log(`Found ${expiredBookings.length} expired bookings`);

    // 2️⃣ Update each expired booking
    for (const booking of expiredBookings) {
      // Update booking status to 'completed'
      booking.status = 'completed';
      booking.completedAt = now;
      await booking.save();

      // Update vehicle status back to 'available'
      await Vehicle.findByIdAndUpdate(
        booking.vehicleId,
        { status: 'available' }
      );

      console.log(`Booking ${booking._id} marked as completed`);
      console.log(`Vehicle ${booking.vehicleId} set to available`);
    }

    console.log(`Successfully processed ${expiredBookings.length} bookings`);

  } catch (error) {
    console.error('Error updating expired bookings:', error);
  }
};


// SCHEDULED TASK - Runs every day at midnight
export const startBookingScheduler = () => {
  // Run at midnight every day (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled booking update...');
    await updateExpiredBookings();
  });

  // Also run every hour for testing 
  cron.schedule('0 * * * *', async () => {
  console.log('Running hourly booking update...');
  await updateExpiredBookings();
  });

  console.log('Booking scheduler started! Will run daily at midnight');
};

// MANUAL TRIGGER (For Admin)
export const manualUpdateBookings = async (req, res) => {
  try {
    await updateExpiredBookings();
    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};