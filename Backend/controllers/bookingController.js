import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

//create booking
export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      paymentMethod,
      pickupLocation,
      returnLocation,
      notes
    } = req.body;

    const customerId = req.user._id;

    // Validate required fields
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'vehicleId is required'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod is required'
      });
    }

    // ✅ Check if vehicle exists - WITH return
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({  // ← RETURN added!
        success: false,
        message: "Vehicle not found"
      });
    }

    // Now vehicle is guaranteed to exist
    // Check if vehicle is available
    if (vehicle.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Vehicle is currently ${vehicle.status}. Please select another vehicle.`
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today || end <= today) {
      return res.status(400).json({
        success: false,
        message: "Booking dates cannot be in the past"
      });
    }

    // Check availability
    const isAvailable = await Booking.isVehicleAvailable(vehicleId, startDate, endDate);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for the selected dates"
      });
    }

    // Calculate days and price
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerDay = vehicle.pricePerDay;  // ✅ Now vehicle is defined

    // Calculate discount
    const subtotal = totalDays * pricePerDay;
    let discountPercentage = 0;
    if (totalDays >= 30) discountPercentage = 20;
    else if (totalDays >= 14) discountPercentage = 15;
    else if (totalDays >= 7) discountPercentage = 10;
    else if (totalDays >= 3) discountPercentage = 5;
    
    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = subtotal - discountAmount;

    // Create booking
    const booking = new Booking({
      customerId,
      vehicleId,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      paymentMethod,
      pickupLocation: pickupLocation || 'Pickup at store',
      returnLocation: returnLocation || 'Return at store',
      notes: notes || '',
      status: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'verification' : 'pending',
      screenshot: null
    });

    // Save booking
    await booking.save();

    // Populate
    await booking.populate('customerId', 'name email phone');
    await booking.populate('vehicleId', 'name brand model pricePerDay image');

    // Response
    const responseData = {
      booking,
      paymentMethod: paymentMethod,
      totalAmount: totalAmount,
      message: paymentMethod === 'online' 
        ? 'Booking created! Please complete online payment and upload screenshot.' 
        : 'Booking created! Please pay cash at pickup.'
    };

    if (paymentMethod === 'online') {
      responseData.qrInfo = {
        amount: totalAmount,
        instructions: 'Scan QR code to pay via eSewa, Khalti, or bank transfer'
      };
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully 🎉",
      data: responseData
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//upload screenshots
export const uploadPaymentScreenshot = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const customerId = req.user._id;

    //find booking 
    const booking = await Booking.findById(bookingId);
    if(!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    //check ownership
    if(booking.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    //check online payment
    if(booking.paymentMethod !== 'online') {
      return res.status(400).json({
        success: false,
        message: 'This booking does not require screenshot upload'
      });
    }
      // Check if already uploaded
    if (booking.screenshot) {
      return res.status(400).json({
        success: false,
        message: 'Screenshot already uploaded'
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a screenshot to upload'
      });
    }

    //upload booking with screenshot
    booking.screenshot = req.file.filename;
    booking.screenshotUploadedAt = new Date();
    booking.paymentStatus = 'verification';

    await booking.save();

    res.json({
      success: true,
      message: 'Screenshot uploaded successfully! Admin will verify shortly. 📸',
      data: {
        bookingId: booking._id,
        screenshot: booking.screenshot,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


//get my bookings
export const getMyBookings = async(req, res) => {
  try{
    const bookings = await Booking.find({customerId: req.user._id})
    .populate('vehicleId', 'name brand model pricePerDay image')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//get single booking
export const getBookingById = async(req, res) => {
  try{
    const booking = await Booking.findById(req.params.id)
    .populate('customerId', 'name email phone')
    .populate('vehicleId', 'name brand model pricePerDay image')
    
    if(!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const isOwner = booking.customerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if(!isOwner && isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking"
      });
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  } 
};

//cancel booking
export const cancelBooking = async(req, res) => {
  try{
    const booking = await Booking.findById(req.params.id);

    if(!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if(booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking"
      });
    }

    if(booking.status == 'completed') {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking"
      });
    }

    if(booking.status == 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

