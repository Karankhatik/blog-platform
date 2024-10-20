import { Schema, model } from 'mongoose';
import { IArticle } from '../utils/types';


const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,        
  },
  slug : {
    type: String,
    lowercase: true,
    trim: true 
  },
  userId: {
    type: String,
    ref: 'User'
  },
  description: {
    type: String,
    trim: true    
  }, 
  feedbacks: {
    type: [String]
  },  
  draftStage: {
    type: Boolean,
    default: true
  },
  articleImage: {
    type: String,
    trim: true
  },
},{timestamps: true});

export default model<IArticle>('Article', ArticleSchema);
