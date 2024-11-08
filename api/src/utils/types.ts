
import { Document, Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import express from "express";

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

  declare global {
    namespace Express {
      interface User {
        _id: string; 
        name?: string;
        email?: string;
      }
      interface Request {
        user?: User; // Optional user property
      }
    }
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

export interface IArticle extends Document {
  title: string;
  content?: string;
  slug: string;
  userId: string;
  description?: string;  
  feedbacks?: string[];
  createdAt?: Date; // Added by Mongoose when timestamps are enabled
  updatedAt?: Date;   
  draftStage: boolean;
  articleImage?: string;

}


