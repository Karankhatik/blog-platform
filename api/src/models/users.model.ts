import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken"
import { IUser } from '../utils/types';

// Schema definition
const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,  
    trim: true,  
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
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
  otp_expiry: Date
}, { timestamps: true });


userSchema.methods.generateAccessToken = function(){
  const secret = process.env.ACCESS_TOKEN_SECRET || '2sdnk@#78n4878909())()rcsdcno4fh'; //default secret key
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
