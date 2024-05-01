import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../utils/types';




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
});

// Create the model
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
