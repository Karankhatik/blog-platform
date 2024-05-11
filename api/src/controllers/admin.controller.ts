import { Request, Response, NextFunction } from 'express';
import Admin from '../models/admin';
import { encryptPassword, decryptPassword, generateJWTAccessToken } from '../utils/comman';
import sanitiseReqBody from '../helpers/sanetize';
import * as httpStatus from "http-status";
import  ApiError  from "../utils/APIError";
import jwt, { JwtPayload } from 'jsonwebtoken';

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const admin = await Admin.findById(userId);

        if (!admin) throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while generating refresh and access tokens");
    }
};


export const register = async (req: Request, res: Response) => {
    try {
        let sanitisedBody: { [key: string]: any } = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = await sanitiseReqBody(unsafeValue);
            sanitisedBody[key] = safeValue;
        }

        let admin = await Admin.findOne({ email: sanitisedBody.email });

        if (admin) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ success: false, message: "Admin already exists" });
        }

        let encryptedPassword = await encryptPassword(sanitisedBody.password);
        sanitisedBody.password = encryptedPassword;

        admin = await Admin.create(sanitisedBody);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Admin signup successfully",
        });
    } catch (error: any) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
};





