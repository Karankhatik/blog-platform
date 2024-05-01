import { Request, Response } from 'express';
import Admin from '../models/admin';
import { encryptPassword, decryptPassword, generateJWTAccessToken } from '../utils/comman';
import sanitiseReqBody from '../helpers/sanetize';
import * as StatusCodes from "http-status";

export const register = async (req: Request, res: Response) => {
    try {
        let sanitisedBody: {[key: string]: any} = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = await sanitiseReqBody(unsafeValue);
            sanitisedBody[key] = safeValue;
        }

        let admin = await Admin.findOne({ email: sanitisedBody.email });

        if (admin) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Admin already exists" });
        }

        let encryptedPassword = await encryptPassword(sanitisedBody.password);
        sanitisedBody.password = encryptedPassword;

        admin = await Admin.create(sanitisedBody);
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Admin signup successfully",            
        });
    } catch (error : any) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        // Sanitize each input
        const email = await sanitiseReqBody(req.body.email);
        const password = await sanitiseReqBody(req.body.password);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: 'Admin not found' });
        }

        const isPasswordValid = await decryptPassword(password, admin.password);

        if (!isPasswordValid) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = generateJWTAccessToken(admin);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Logged in successfully',
            token,
            admin: { id: admin.id, email: admin.email }  
        });
    } catch (error : any) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
};



export const logout = async (req: Request, res: Response) => {
  try {
    res
      .status(StatusCodes.OK)
      .cookie("token", null, {
        expires: new Date(Date.now())
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};
