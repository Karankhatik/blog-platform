
import { Document } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken: string
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}