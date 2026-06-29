import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      minlingth: [2, 'Name must be at least 2 characters']
    },

    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      
    },
    brand: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative']
    },
    pricePerWeek: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance', 'unavailable'],
      default: 'available',
      required: true
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
      set: function(value) {
        return Math.round(value * 10) / 10;
      },
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }],
    specifications: {
      engine: String,
      transmission: {
        type: String,
        enum: ['manual', 'automatic', 'semi-automatic'],
      },
      fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      },
      seats: {
        type: Number,
        min: 1,
        max: 50,
      },
      mileage: {
        type: String, // e.g., "25 km/l"
      }
    },
    description: {
    type: String,
    trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
  }
  },
  {timestamps: true}
);

vehicleSchema.methods.isAvailable = function() {
  return this.status === 'available';
};
//rating
vehicleSchema.methods.updateRating = async function(newRating) {
  const total = (this.rating * this.reviews.length) + newRating;
  this.rating = Math.round((total / (this.reviews.length + 1)) * 10) /10;
  return this.save();
};

vehicleSchema.index({ type: 1, status: 1 });
vehicleSchema.index({ brand: 1 });
vehicleSchema.index({ pricePerDay: 1 });
vehicleSchema.index({ rating: -1 });



export default mongoose.model('Vehicle', vehicleSchema);