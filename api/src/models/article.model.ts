import { Schema, model } from 'mongoose';
import { IArticle } from '../utils/types';


const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true
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
    type: String    
  }, 
  feedbacks: {
    type: [String]
  },  
},{timestamps: true});

export default model<IArticle>('Article', ArticleSchema);
