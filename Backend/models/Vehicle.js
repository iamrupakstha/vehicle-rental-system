import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ['bike', 'scooter', 'car', 'cycle'],
      required: true
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available',
      required: true
    },
    image: {
      type: String
    },
    attributes: {
      type: Object
    }
  },
  {timestamps: true}
);

export default mongoose.model('Vehicle', vehicleSchema);