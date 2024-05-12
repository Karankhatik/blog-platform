import httpStatus from "http-status";
import User from "../models/users.model"; 
import sendMail from "../utils/sendMail"; 
import { encryptPassword, generateOTP } from "../utils/comman"; 
import sanitiseReqBody from '../helpers/sanetize'; 
import ApiError from "../utils/APIError"; 
import { Request, Response, NextFunction } from 'express';
import {otpSendToEmailForSignUp} from "../emailTemplate/otpSendToEmailForSignUp";
import { otpSendToEmailForResetPassword } from "../emailTemplate/otpSendToEmailForResetPassword";

const register = async (req: Request, res: Response) => {
  try {
    let sanitiseBody: any = {};
    for (let key in req.body) {
      let unsafeValue = req.body[key];
      let safeValue = await sanitiseReqBody(unsafeValue);
      sanitiseBody[key] = safeValue;
    }   

    let user = await User.findOne({ email: sanitiseBody.email });

    if (user && user.verified) {      
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        message: "User already exists",
      });
    }

    if (user && !user.verified) {
      await User.findByIdAndDelete(user._id);
    }

    let encryptedPassword = await encryptPassword(sanitiseBody.password);
    const otp = generateOTP();
    sanitiseBody.password = encryptedPassword;
    sanitiseBody.otp = otp;
    sanitiseBody.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);

    let htmlContent = await otpSendToEmailForSignUp(sanitiseBody.otp);    
    
    user = await User.create({
      name: sanitiseBody.name,
      email: sanitiseBody.email,
      password: sanitiseBody.password,
      otp: sanitiseBody.otp,
      otp_expiry: sanitiseBody.otp_expiry,
    });
    await sendMail({ email: sanitiseBody.email, subject: "Email Verification - Intake Learn", bodyHtml: htmlContent });

    let resMessage = "OTP sent to your email, please verify your account";
    sanitiseBody.password = null;
    sanitiseBody.otp = null;

    res.status(httpStatus.CREATED).json({ success: true, message: resMessage, user: user });
  } catch (error) {  
    console.log(error);  
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Request failed. Please check your request and try again.",
    });
  }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
      let sanitiseBody: { [key: string]: any } = {};
      for (let key in req.body) {
          let unsafeValue = req.body[key];
          let safeValue = await sanitiseReqBody(unsafeValue);
          sanitiseBody[key] = safeValue;
      }
      const otp = Number(sanitiseBody.otp);      

      const user = await User.findOne({email: sanitiseBody.email});
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });          
      }
      if (user.otp !== otp) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid OTP",
        });  
      }
      if (user.otp_expiry && user.otp_expiry.getTime() < Date.now()) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "OTP has been expired",
        });          
      }
      
      user.verified = true;
      user.otp = null;
      user.otp_expiry = null;

      await user.save();
      res.status(httpStatus.OK).json({ success: true, message: "Account Verified", user: user });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Request failed. Please check your request and try again.",
    });
  }
};



const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const id = await sanitiseReqBody(req.body.email);    
    const user = await User.findById(id);
    if (!user) {
    return;
      //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }
    res.status(httpStatus.OK).json({ success: true, message: `Welcome back ${user.name}`, user });
  } catch (error) {
    //return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    
    let sanitiseBody: any = {};
    for (let key in req.body) {
      let unsafeValue = req.body[key];
      let safeValue = await sanitiseReqBody(unsafeValue);
      sanitiseBody[key] = safeValue;
    }

    const user = await User.findById(sanitiseBody._id);
    if (!user) {
      return;
      //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }
    user.name = sanitiseBody.name;
    user.profileImage = sanitiseBody.profileImage;

    await user.save();
    res.status(httpStatus.OK).json({ success: true, message: "Profile Updated successfully" });
  } catch (error) {
    //return next(new APIError("Request failed. Please check your request and try again..", httpStatus.BAD_REQUEST, true));
  }
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sanitiseBody: any = {};
    for (let key in req.body) {
      let unsafeValue = req.body[key];
      let safeValue = await sanitiseReqBody(unsafeValue);
      sanitiseBody[key] = safeValue;
    }
    const user = await User.findById(sanitiseBody._id);

    if (!user) {
      return;
      //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }

    let encryptedPassword = await encryptPassword(sanitiseBody.password);
    user.password = encryptedPassword;
    await user.save();

    res.status(httpStatus.OK).json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    //return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
  }
};


const reSendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      let email = await sanitiseReqBody(req.body.email);       
  
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
  
      const otp = Number(generateOTP());
      user.otp = otp;
      user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
      await user.save();
  
      let htmlContent = await otpSendToEmailForSignUp(otp);  
  
      await sendMail({ email: email, subject: "Resend OTP - Intake Learn", bodyHtml: htmlContent });
      res.status(httpStatus.OK).json({ success: true, message: `OTP resent successfully` });

    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Request failed. Please check your request and try again.",
      });    }
  };
  
  const applyForEditor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let sanitiseBody: any = {};
      for (let key in req.body) {
        let unsafeValue = req.body[key];
        let safeValue = await sanitiseReqBody(unsafeValue);
        sanitiseBody[key] = safeValue;
      }

      if (sanitiseBody.isRequested) {
        return;
       // return next(new APIError("You have already requested for Editor.", httpStatus.BAD_REQUEST, true));
      }
  
      const user = await User.findById(sanitiseBody._id);
      if (!user) {
        return;
        //return next(new APIError("User not found.", httpStatus.NOT_FOUND, true));
      }
      user.isRequested = true;
      await user.save();
  
      let htmlContent = `<h2>Dear admin,\n\nPlease approve this user as Editor. Email: ${user.email}.</h2>`;
      await sendMail({ email: sanitiseBody.email, subject: "Application for Editor", bodyHtml: htmlContent });
      res.status(httpStatus.OK).json({ success: true, message: "Email sent to admin! Please wait until we processed your request." });
    } catch (error) {
      //next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
  };

  const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {      
      const email = await sanitiseReqBody(req.body.email);
  
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email"));
      }
  
      const otp = Number(generateOTP()); 
      user.otp = Number(otp);
      user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
  
      await user.save();
  
      const htmlContent = await otpSendToEmailForResetPassword(otp);
  
      await sendMail({ email: email, subject: "Request for Resetting Password", bodyHtml: htmlContent });
      return res.status(httpStatus.OK).json({ success: true, message: `OTP sent to your email, please verify your account` });
    } catch (error) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "Invalid Email"));
    }
  };
  
  const resetPassword = async (req: Request, res: Response, next: NextFunction) => {    
    try {
      let sanitiseBody: any = {};
      for (const key in req.body) {
        const unsafeValue = req.body[key];
        const safeValue = await sanitiseReqBody(unsafeValue);
        sanitiseBody[key] = safeValue;
      }
      const { otp, newPassword, email } = sanitiseBody;

      const user = await User.findOne({email});      
  
      if (!user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "User not found"));
      }     

      if (user.otp !== otp) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid OTP",
        });  
      }
      if (user.otp_expiry && user.otp_expiry.getTime() < Date.now()) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "OTP has been expired",
        });          
      }
  
      const encryptedPassword = await encryptPassword(newPassword); 
      user.otp = null;
      user.otp_expiry = null;
      user.password = encryptedPassword;
      await user.save();
  
      return res.status(httpStatus.OK).json({ success: true, message: "Password Changed Successfully" });
    } catch (error) {
      console.log(error)
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Request failed. Please check your request and try again."));
    }
  };

export {
    register,
    verify,
    getMyProfile,
    updateProfile,
    updatePassword,
    forgetPassword,
    resetPassword,
    reSendOtp,
    applyForEditor
  };