
import { Document, Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken: string
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    isEditor: boolean;
    isRequested: boolean;
    refreshToken: string;
    profileImage?: string; 
    otp?: number | null;                                
    otp_expiry?: Date | null;     
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
  }

export interface EmailOptions {
    email: string;
    subject: string;
    bodyHtml: string;
  }

export interface TokenPayload extends JwtPayload {
    email: string;
  }

export interface AuthRequest extends Request {
    user?: any;
    admin?: any;
  }

  export const options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
} = {
    httpOnly: false,  // Cookie cannot be accessed by client-side APIs like JavaScript
    secure: true,    // Cookie is only sent over HTTPS
    sameSite: 'none', // Cookie is allowed to be sent with cross-site requests
    path: '/'        // Cookie is available across the entire site
};

export interface IChapter extends Document {
  title: string;
  content?: string;
  chapterSlug: string;
  userId: string;
  metaDescription?: string;
  keyPhrase?: string;
  tags?: string[];
  courseId?: string;
  feedbacks?: string[];
  createdAt?: Date; // Added by Mongoose when timestamps are enabled
  updatedAt?: Date;                                 
}

export interface ICourse extends Document {
  title: string;
  description: string;
  userId: string;
  timestamps: true;
  courseSlug : string;
  createdAt?: Date; // Added by Mongoose when timestamps are enabled
  updatedAt?: Date;  
}
