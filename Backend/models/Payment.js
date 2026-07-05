import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending','paid', 'verification',  'failed'],
      default: 'pending'
  },
  screenshot: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  verifiedAt: {
    type: Date,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
},
  {
    timestamps: true
  }
);

export default mongoose.model('Payment', paymentSchema);