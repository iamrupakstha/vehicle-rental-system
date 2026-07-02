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
    //pricing
    pricePerDay: {
      type: Number,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
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
      required: true
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
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash'],
      required: true
    },

    //extra info
    notes: {
      type: String,
      trim: true
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

//calculate discount
bookingSchema.methods.calculateDiscount = function() {
  const days = this.totalDays;

  //default no discount
  let discountPercentage = 0;


  // Apply discount based on days
  if (days >= 30) {
    discountPercentage = 20; // 20% for 30+ days
  } else if (days >= 14) {
    discountPercentage = 15; // 15% for 14-29 days
  } else if (days >= 7) {
    discountPercentage = 10; // 10% for 7-13 days
  } else if (days >= 3) {
    discountPercentage = 5;  // 5% for 3-6 days
  }
//calculate amounts
this.subtotal = days * this.pricePerDay;
this.discountPercentage = discountPercentage;
this.discountAmount = (this.subtotal * discountPercentage) / 100;
this.totalAmount = this.subtotal - this.discountAmount; 
};

export default mongoose.model('Booking', bookingSchema);
