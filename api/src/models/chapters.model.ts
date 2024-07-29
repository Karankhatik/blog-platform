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
  },
  chapterSlug : {
    type: String,
    lowercase: true,
    trim: true 
  },
  userId: {
    type: String,
    ref: 'User'
  },
  metaDescription: {
    type: String    
  },
  keyPhrase: {
    type: String
  },
  tags: {
    type: [String]
  },  
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  feedbacks: {
    type: [String]
  },  
},{timestamps: true});

export default model<IChapter>('Chapter', ChapterSchema);
