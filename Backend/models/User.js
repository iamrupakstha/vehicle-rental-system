import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required : [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer'
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    googleId: {
      type: String
    }
  },
  {timestamps: true}
);

export default mongoose.model('User', userSchema);