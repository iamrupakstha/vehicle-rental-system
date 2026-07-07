import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    //who booked
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    //what they are booking
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },

    //when
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    },
    //pricing
    pricePerDay: {
      type: Number,
      required: true,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },

    //discount
    discountPercentage: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    //Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    //payment
    paymentStatus:{
      type: String,
      enum: ['pending', 'verification', 'paid', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash'],
      required: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    
    //screenshot (for online)
    screenshot: {
      type: String,
      dafault: null
    },
    screenshotUploadedAt: {
      type: Date
    },
    // Location
    pickupLocation: {
      type: String,
      trim: true
    },
    returnLocation: {
      type: String,
      trim: true
    },
    //extra info
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    // Timestamps for tracking
    confirmedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    },
    paymentVerifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

//checking avaibility of vehicle
bookingSchema.statics.isVehicleAvailable = async function(vehicleId, startDate, endDate) {
  const existingBooking = await this.findOne({
    vehicleId: vehicleId,
    status: {$in: ['pending', 'confirmed']},
    $or: [
      {
        startDate: {$lte: endDate}, endDate: {$lte: startDate}
      }
    ]
  });
  return !existingBooking;
}

// Calculate booking price with discount
bookingSchema.methods.calculatePrice = function() {
  const days = this.totalDays;
  const subtotal = days * this.pricePerDay;
  
  let discountPercentage = 0;
  if (days >= 30) discountPercentage = 20;
  else if (days >= 14) discountPercentage = 15;
  else if (days >= 7) discountPercentage = 10;
  else if (days >= 3) discountPercentage = 5;
  
  const discountAmount = (subtotal * discountPercentage) / 100;
  
  this.subtotal = subtotal;
  this.discountPercentage = discountPercentage;
  this.discountAmount = discountAmount;
  this.totalAmount = subtotal - discountAmount;
};
//index
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ vehicleId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

export default mongoose.model('Booking', bookingSchema);
