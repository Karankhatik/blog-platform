import { Schema, model, Document } from 'mongoose';
import { ICourse } from '../utils/types';

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    ref: 'User' 
  },
  courseSlug : {
    type: String,
    unique: true,
    lowercase: true,
    trim: true  
  },
  timestamps: true,
});

const Course = model<ICourse>('Course', CourseSchema);

export default Course; 