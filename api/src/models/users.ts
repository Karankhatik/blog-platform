import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  isReporter: boolean;
  isRequested: boolean;
  logout: boolean;
  profileImage?: string; // Optional field
  otp?: number | null; // Corrected type union                               
  otp_expiry?: Date | null; // Corrected type union and marked as optional
  resetPasswordOtp?: number; // Marked as optional
  resetPasswordOtpExpiry?: Date; // Marked as optional
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
  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date,
}, { timestamps: true });

// Create the model according to the schema.
const User = mongoose.model<IUser>('User', userSchema);

export default User;
