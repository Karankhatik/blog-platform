import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../utils/types';
import jwt from "jsonwebtoken";


// Define the admin schema
const adminSchema: Schema = new Schema({
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
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String
  }
});

adminSchema.methods.generateAccessToken = function(){
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

adminSchema.methods.generateRefreshToken = function(){
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


// Create the model
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
