import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { populate } from "dotenv";

//Dashboard statistics
export const getDashboardStats = async(req, res) => {
  try{
    //get all counts
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    //vehicle status breakdown
    const availableVehicles = await Vehicle.countDocuments({status: 'available'});
    const rentedVehicles = await Vehicle.countDocuments({status: 'rented'});
    const maintenanceVehicles = await Vehicle.countDocuments({status: 'maintenance'});
    
    //Booking status
    const pendingBookings = await Booking.countDocuments({status: 'pending'});
    const confirmedBookings = await Booking.countDocuments({status: 'confirmed'});
    const completedBookings = await Booking.countDocuments({status: 'completed'});
    const cancelledBookings = await Booking.countDocuments({status: 'cancelled'});

    //payment status
    const pendingPayments = await Booking.countDocuments({ paymentStatus: 'pending' });
    const verificationPayments = await Booking.countDocuments({ paymentStatus: 'verification' });
    const paidPayments = await Booking.countDocuments({ paymentStatus: 'paid' });
    const failedPayments = await Booking.countDocuments({ paymentStatus: 'failed' });

    //total revenue from confirmed and completed bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: { //match is used to tilter data
          status: { $in: ['confirmed', 'completed']},
          paymentStatus: 'paid'
        }
      },
      {
        $group: { //group is used to group and calculate
          _id: null, total: { $sum: '$totalAmount'}
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    //monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed']},
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt'},
            month: { $month: '$createdAt'}
          },
          total: {$sum: '$totalAmount'},
          count: { $sum: 1}
        }
      },
      {$sort: {'_id.year': -1, '_id.month': -1}}, //sort used to sort data
      { $limit: 6}
    ]);

    //payment methods
    const paymentMethods = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'confirmed']},
          paymentStatus: 'paid'
        }
      },
      { $group: {_id: '$paymentMethod', total: {$sum: '$totalAmount'}, count: {$sum: 1}}}
    ]);

    //recent booking
    const recentBookings = await Booking.find() 
    .populate('customerId', 'name email')
    .populate('vehicleId', 'name brand')
    .sort({createdAt: -1})
    .limit(5);

    //vehicle type breakdown
    const vehicleTypes = await Vehicle.aggregate([
      { $group: { 
        _id: '$type',
        count: { $sum: 1}}}
    ]);

    //user breakdown
    const userRoles = await User.aggregate([
      { $group: { 
        _id: '$role',
        count: { $sum: 1}
      }}
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalVehicles,
          totalBookings,
          totalRevenue
        },
        vehicles: {
          total: totalVehicles,
          available: availableVehicles,
          rented: rentedVehicles,
          maintenance: maintenanceVehicles,
          byType: vehicleTypes
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
         payments: {
          pending: pendingPayments,
          verification: verificationPayments,
          paid: paidPayments,
          failed: failedPayments,
          byMethod: paymentMethods
        },
        users: {
          total: totalUsers,
          byRole: userRoles
        },
        monthlyRevenue,
        recentBookings
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//AUTH- USERS

//get all users
export const getAllUsers = async(req, res) => {
  try{
    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  }catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//updage userRoles
export const updateUserRole = async(req, res) => {
  try{
    const {role} = req.body;
    const userId = req.params.id;

    //validate role
    if(!role){
      return res.status(400).json({
        success: false,
        message: "Role is required."
      })
    };
    if(!['admin', 'customer'].includes(role)){
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin or customer'
      })
    }
    //prevent changing own role
    if(userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {role},
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if(!user) {
       return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role} successfully!`,
      data: user
    });
    
  }catch (error){
     res.status(500).json({
      success: false,
      message: error.message
      
    });
  }

}

//delete users
export const deleteUser = async (req, res) => {
  try{
    const userId = req.params.id;

    //prevent detecting yourself
    if(userId === req.user._id.toString()){
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
       return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully!",
      data: {
        id: userId,
        name: user.name,
        email: user.email
      }
    });
  }
  catch (error){
     res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//Vehilces management
// create vehicles
export const createVehicle = async (req, res) => {
  try{
    const vehicleData = req.body;

    if(!vehicleData.pricePerWeek && vehicleData.pricePerDay) {
      vehicleData.pricePerWeek = vehicleData.pricePerDay * 5;
    }

    if(req.file) {
      vehicleData.image = req.file.filename;
    }

    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

// Update vehicles
export const updateVehicle = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Auto-calculate pricePerWeek if pricePerDay is updated
    if (updateData.pricePerDay && !updateData.pricePerWeek) {
      updateData.pricePerWeek = updateData.pricePerDay * 5;
    }
    
    // If new image uploaded, update image
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehicle updated successfully!',
      data: vehicle
    });
    
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// delete vehicle
export const deleteVehicle = async (req, res) => {
  try{
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if(!vehicle) {
      return res.status(404).json({message: 'Vehicle not found'});
    }
    res.json({
      success: true,
      message: "Vehicle deleted successfully!"
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};


//get vehicle statistics
export const getVehicleStats = async (req, res) => {
  try {
    const total = await Vehicle.countDocuments();
    const available = await Vehicle.countDocuments({ status: 'available' });
    const rented = await Vehicle.countDocuments({ status: 'rented' });
    const maintenance = await Vehicle.countDocuments({ status: 'maintenance' });
    const unavailable = await Vehicle.countDocuments({ status: 'unavailable' });
    
    // Group by type
    const typeStats = await Vehicle.aggregate([
      { $group: { 
        _id: '$type', 
        count: { $sum: 1 },
        avgPrice: { $avg: '$pricePerDay' }
      } }
    ]);
    
    // Average rating
    const avgRating = await Vehicle.aggregate([
      { $group: { 
        _id: null, 
        avgRating: { $avg: '$rating' } 
      } }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        available,
        rented,
        maintenance,
        unavailable,
        byType: typeStats,
        averageRating: avgRating[0]?.avgRating || 0
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//get vehicle review
export const getVehicleReviews = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).select('name rating reviews');

    if(!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    //sort reviews by newest first
    const reviews = vehicle.reviews.sort((a,b) => {
      new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.json({
      success: true,
      message: "Review added successfully!",
      data: {
        rating: vehicle.rating,
        totalReviews: vehicle.reviews.length,
        reviews: vehicle.reviews
      }
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


//BOOKINGS management

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

//  VERIFY PAYMENT (Admin)
export const verifyBookingPayment = async(req, res) => {
  try {
    const {bookingId, status, notes} = req.body;

    if(!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Booking Id and Status are required'
      });
    }

    //find booking 
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    // For online payments, check screenshot
    if (booking.paymentMethod === 'online' && !booking.screenshot && status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify online payment without screenshot'
      });
    }
    //update booking
    booking.status = status === 'paid' ? 'confirmed' : 'cancelled';
    booking.paymentStatus = status === 'paid' ? 'paid' : 'failed';
    booking.paymentVerifiedAt = new Date();
    if(notes) booking.notes = notes;

    await booking.save();

    // update vehicle status if confirm
    if(status === 'paid') {
      await Vehicle.findByIdAndUpdate(booking.vehicleId, {status: 'rented'});
    }

    res.json({
      success: true,
      message: status === 'paid' 
        ? 'Payment verified! Booking confirmed.' 
        : 'Payment verification failed. Booking cancelled.',
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


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

//PAYMENT AND REVENUE
//get all payments from bookings
export const getAllPayments = async (req, res) => {
  try {
    const { paymentStatus, page = 1, limit = 100} = req.query;

    const filter = {};
    if(paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    //get all booking with payment info
    const bookings = await Booking.find(filter)
    .populate('customerId', 'name email phone')
    .populate('vehicleId', 'name brand model pricePerDay')
    .select('customerId vehicleId totalAmount paymentMethod paymentStatus screenshot notes createdAt paymentVerifiedAt verifiedBy')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    //transform to payment
    const payments = bookings.map(booking => ({
      _id: booking._id,
      bookingId: booking._id,
      customerId: booking.customerId,
      vehicleId: booking.vehicleId,
      amount: booking.totalAmount,
      method: booking.paymentMethod,
      status: booking.paymentStatus,
      screenshot: booking.screenshot,
      notes: booking.notes,
      createdAt: booking.createdAt,

      //for admin verification
      verifiedBy: booking.verifiedBy || null,
      verifiedAt: booking.paymentVerifiedAt || null
    }));
    res.json({
      success: true,
      count: payments.length, total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: payments
    })
  } catch(error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

//revenue report from bookings
export const getRevenueReport = async (req, res) => {
  try {
    const { period = 'monthly'} = req.query;
    let dateFormat;

    if(period === 'daily') {
      dateFormat = {
        year: {$year: '$createdAt'},
        month: {$month: '$createdAt'},
        day: {$dayOfMonth: '$createdAt'}
      };
    } else if (period === 'weekly') {
      dateFormat = {
        year: {$year: '$createdAt'},
        week: { $week: '$createdAt'}
      };
    } else {
      dateFormat = {
        year: {$year: '$createdAt'},
        month: { $month: '$createdAt'}
      };
  }

   // Revenue from confirmed & completed bookings
    const revenueData = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid'
        } 
      },
      {
        $group: {
          _id: dateFormat,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Payment method breakdown
    const paymentMethods = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid'
        } 
      },
      { $group: { _id: '$paymentMethod', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    // Top vehicles by revenue
    const topVehicles = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid'
        } 
      },
      {
        $group: {
          _id: '$vehicleId',
          totalRevenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicle'
        }
      },
      { $unwind: '$vehicle' },
      {
        $project: {
          vehicleName: '$vehicle.name',
          vehicleBrand: '$vehicle.brand',
          totalRevenue: 1,
          bookings: 1
        }
      }
    ]);

    // Total revenue
    const totalRevenueResult = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid'
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalRevenue: totalRevenueResult[0]?.total || 0,
        revenueData,
        paymentMethods,
        topVehicles,
        totalBookings: revenueData.reduce((sum, item) => sum + item.count, 0)
      }
    });

} catch(error) {
  res.status(500).json({
      success: false,
      message: error.message
  });
}
}

// get payment stats from bookings

export const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Booking.countDocuments({ 
      paymentStatus: { $in: ['pending', 'verification', 'paid', 'failed'] } 
    });
    
    const pendingPayments = await Booking.countDocuments({ paymentStatus: 'pending' });
    const verificationPayments = await Booking.countDocuments({ paymentStatus: 'verification' });
    const paidPayments = await Booking.countDocuments({ paymentStatus: 'paid' });
    const failedPayments = await Booking.countDocuments({ paymentStatus: 'failed' });

    // Revenue from paid bookings
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Payment method stats
    const methodStats = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalPayments,
        pending: pendingPayments,
        verification: verificationPayments,
        paid: paidPayments,
        failed: failedPayments,
        totalRevenue: revenue[0]?.total || 0,
        byMethod: methodStats
      }
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};