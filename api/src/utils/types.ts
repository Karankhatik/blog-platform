
import { Document } from 'mongoose';
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
} = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'  
};