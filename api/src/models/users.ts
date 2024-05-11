import mongoose, { Schema, Document } from 'mongoose';
import jwt from "jsonwebtoken"

// Define an interface representing a document in MongoDB.
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  isReporter: boolean;
  isRequested: boolean;
  logout: boolean;
  refreshToken: string;
  profileImage?: string; 
  otp?: number | null;                                
  otp_expiry?: Date | null; 
  resetPasswordOtp?: number; 
  resetPasswordOtpExpiry?: Date; 
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}


// Schema definition
const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isEditor: {
    type: Boolean,
    default: false,
  },
  isRequested: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  refreshToken: String,
  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date,
}, { timestamps: true });


userSchema.methods.generateAccessToken = function(){
  const secret = process.env.ACCESS_TOKEN_SECRET || '2sdnkn4rcsdcno4fh'; //default secret key
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      secret,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h'
      }
  )
}

userSchema.methods.generateRefreshToken = function(){
  const secret = process.env.REFRESH_TOKEN_SECRET || 'kjvldkfvlndfdfbvdvnsdv'; //default secret key
  return jwt.sign(
      {
          _id: this._id
      },
      secret,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
      }
  )
}

// Create the model according to the schema.
const User = mongoose.model<IUser>('User', userSchema);

export default User;
