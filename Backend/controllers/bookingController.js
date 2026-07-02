import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

//create booking
export const createBooking = async (req, res) => {
  try {
    //get data from request body
    const {vehicleId, startDate, endDate, paymentMethod, notes} = req.body;
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

    if(!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod is required'
      });
    }
  
    //check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if(!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }
    //check if vehicle is available for booking
    if(vehicle.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Vehicle is currently ${vehicle.status}. Please Select another vehicle or try again later.`
      });
    }

    //validate booking dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    if(start < today || end <= today) {
      return res.status(400).json({
        success: false,
        message: "Booking dates cannot be in the past"
      });
    }
    //check if vehicle is available for the given dates
    const isAvailable = await Booking.isVehicleAvailable(vehicleId, startDate, endDate);

    if(!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for the selected dates"
      });
    }

    //calculate days and price
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerDay = vehicle.pricePerDay;
    

    // create booking
    const booking = await Booking.create({
      customerId,
      vehicleId,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay,
      paymentMethod,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    //Calculate discount
    booking.calculateDiscount();

    //save booking
    await booking.save();

    //populate vehicle and customer details
    await booking.populate('customerId', 'Name email phone');
    await booking.populate('vehicleId', 'make model year');

    //res
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch(error) {
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

//admin get all bookings
export const getAllBookings = async(req, res) => {
  try{
    const {status, page = 1, limit = 10} = req.query;

    const filter = {};
    if(status) filter.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
    .populate('customerId', 'name email phone')
    .populate('vehicleId', 'name brand model pricePerDay image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      bookings
    })

  }catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
} 

//update booking status
export const updateBookingStatus = async(req, res) => {
  try {
    const {status} = req.body;
    if(!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const validateStatus = ['pending', 'confirmed', 'completed', 'cancelled'];
    if(!validateStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const booking = await Booking.findById(req.params.id);
    if(!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully"
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//get booking stats
export const getBookingStats = async(req, res) => {
  try{
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({status: 'pending'});
    const confirmedBookings = await Booking.countDocuments({status: 'confirmed'});
    const completedBookings = await Booking.countDocuments({status: 'completed'});
    const cancelledBookings = await Booking.countDocuments({status: 'cancelled'});

    const renenueStats = await Booking.aggregate([
      { $match: {status: { $in: ['confirmed', 'completed']}}},
      {$group: {_id: null, totalRevenue: {$sum: "$totalAmount"}}}
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: renenueStats[0]?.totalRevenue || 0
      }
    })

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  } 
}