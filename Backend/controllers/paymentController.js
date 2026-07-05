import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

//create payment 
export const createPayment = async (req, res) => {
  try{
    const [bookingId, amount, status] = req.body;
    const customerId = req.user.id; //from auth middleware
    //validate required field
    if(!bookingId) {
     return res.status(400).json({
        success: false,
        message: 'bookingId is required'
      }); 
    }
    if (!method) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required (online, cash, card)'
      });
    }
     if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }
    //check if payments already exists 
    const existingPayment = await Payment.findOne({
      bookingId
    });
    if(existingPayment){
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this booking"
      });
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment for this booking'
      });
    }

    //create new payment
    const payment = await Payment.create(
      {
      bookingId,
      customerId,
      amount,
      method,
      status: method === 'online' ? 'verification' : 'pending'
      }
    );

    // Populate for response
    await payment.populate('bookingId', 'startDate endDate totalAmount status');
    await payment.populate('customerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Payment created successfully!',
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

//upload screenshot
export const uploadScreenshot = async (req, res) => {
  try{
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if(!payment) {
      return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
    }

    // check if user owns this payment
    if(payment.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized"
      });
    }
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a screenshot to upload'
      });
    }

    // Save screenshot
    payment.screenshot = req.file.filename;
    payment.status = 'verification';
    await payment.save();
    res.json({
      success: true,
      message: 'Screenshot uploaded successfully! 📸',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
//verify payment by admin
export const verifyPayment = async (req, res) => {
  try {
    const {status, notes} = req.body;
    const payment = await Payment.findById(req.params.id);

    if(!payment) {
      res.status(404).json({
      success: false,
      message: 'Payment not found'
    })
    }
     // Check if payment has screenshot for online payments
    if (payment.method === 'online' && !payment.screenshot && status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify payment without screenshot'
      });
    }
    //update payment
    payment.status = status;
    payment.verifiedBy = req.user._id;
    payment.verifyAt = new Date();
    if(notes) payment.notes = notes;

    await payment.save();

    //updating booking payment status
    const booking = await Booking.findById(payment.bookingId);
    if(booking) {
      booking.paymentStatus = status === 'paid' ? 'paid' : 'failed';
      if(status === 'paid') {
        booking.status = 'confirmed';
      }
      await booking.save();

      //populate for response
      await payment.populate('bookingId', 'startDate endDate totalAmount');
      await payment.populate('customerId', 'name email phone')
      await payment.populate('verifiedBy', 'name, email')
    }

    res.json({
      success: true,
      message: `Payment ${status} successfully!`,
      data: payment
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//get my payments(user)
export const getUserPayments = async (req, res) => {
  try {
    const payment = await Payment.find({customerId: req.params._id})
    .populate('bookingId', 'vehicleId startDate endDate totalAmount status')
    .sort({createdAt: -1});

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//get all payment (admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customerId', 'name email phone')
      .populate('bookingId', 'startDate endDate totalAmount status')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//get payment by id(admin)
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('customerId', 'name email')
      .populate('verifiedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    const isOwner = payment.customerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};