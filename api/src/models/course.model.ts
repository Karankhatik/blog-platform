import { Schema, model, Document } from 'mongoose';

interface ICourse extends Document {
  title: string;
  description: string;
  userId: string;
  chapterIds: Schema.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User' // This reference indicates the model to which this ID relates
  },
  chapterIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Chapter'
  }]
});

const Course = model<ICourse>('Course', CourseSchema);

export default Course; 