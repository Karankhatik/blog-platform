// models/Chapter.ts
import { Schema, model, Document } from 'mongoose';
import { IChapter } from '../utils/types';


const ChapterSchema = new Schema<IChapter>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
});

export default model<IChapter>('Chapter', ChapterSchema);
