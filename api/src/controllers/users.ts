import httpStatus from "http-status";
import User from "../models/users"; 
import sendMail from "../utils/sendMail"; 
import { encryptPassword, generateJWTAccessToken, generateOTP, decryptPassword } from "../utils/comman"; 
import ejs from "ejs";
import path from "path";
import sanitiseReqBody from '../helpers/sanetize'; 
import APIError from "../utils/APIError"; 
import { Request, Response, NextFunction } from 'express';


const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sanitiseBody: any = {};
    for (let key in req.body) {
      let unsafeValue = req.body[key];
      let safeValue = await sanitiseReqBody(unsafeValue);
      sanitiseBody[key] = safeValue;
    }   

    let user = await User.findOne({ email: sanitiseBody.email });

    if (user && user.verified) {
      res.status(httpStatus.CONFLICT).json({
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

    //let htmlContent = await ejs.renderFile(path.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"), { otp });
    
    user = await User.create({
      name: sanitiseBody.name,
      email: sanitiseBody.email,
      password: sanitiseBody.password,
      otp: sanitiseBody.otp,
      otp_expiry: sanitiseBody.otp_expiry,
    });
    await sendMail({ email: sanitiseBody.email, subject: "Email Verification", bodyHtml: `Please check your mail and verify the otp ${otp}` });

    //let token = generateJWTAccessToken(user);
    let resMessage = "OTP sent to your email, please verify your account";
    sanitiseBody.password = null;
    sanitiseBody.otp = null;

    res.status(httpStatus.CREATED).json({ success: true, message: resMessage, user: user });
  } catch (error) {    
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sanitiseBody: any = {};
    for (let key in req.body) {
      let unsafeValue = req.body[key];
      let safeValue = await sanitiseReqBody(unsafeValue);
      sanitiseBody[key] = safeValue;
    }
    const user = await User.findOne({ email: sanitiseBody.email }).select("+password");
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid user Email.",
      });    
    }

    const isMatched = await decryptPassword(sanitiseBody.password, user.password);

    if (!isMatched) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid user Password.",
      });
    }

    let token = generateJWTAccessToken(user);
    if (user.verified) {
      res.status(httpStatus.OK).json({ success: true, message: "User logged in successfully", user, token });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Please register your account first",
      });
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Request failed. Please check your request and try again.",
    });  
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await sanitiseReqBody(req.body._id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found",
      })
    }
    res
      .status(httpStatus.OK)
      .cookie("token", null, {
        expires: new Date(Date.now())
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const id = await sanitiseReqBody(req.body.email);    
    const user = await User.findById(id);
    if (!user) {
      return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }
    res.status(httpStatus.OK).json({ success: true, message: `Welcome back ${user.name}`, user });
  } catch (error) {
    return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
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
      return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }
    user.name = sanitiseBody.name;
    user.profileImage = sanitiseBody.profileImage;

    await user.save();
    res.status(httpStatus.OK).json({ success: true, message: "Profile Updated successfully" });
  } catch (error) {
    return next(new APIError("Request failed. Please check your request and try again..", httpStatus.BAD_REQUEST, true));
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
      return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
    }

    let encryptedPassword = await encryptPassword(sanitiseBody.password);
    user.password = encryptedPassword;
    await user.save();

    res.status(httpStatus.OK).json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
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
  
      const otp = generateOTP();
      user.otp = Number(otp);
      user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
      await user.save();
  
      // let htmlContent = await ejs.renderFile(
      //   path.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"),
      //   { otp }
      // );
  
      await sendMail({ email: email, subject: "Resend OTP", bodyHtml: `otp sended ${otp}` });
      res.status(httpStatus.OK).json({ success: true, message: `OTP sent to ${email}` });

    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Request failed. Please check your request and try again.",
      });    }
  };
  
  const applyForReporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let sanitiseBody: any = {};
      for (let key in req.body) {
        let unsafeValue = req.body[key];
        let safeValue = await sanitiseReqBody(unsafeValue);
        sanitiseBody[key] = safeValue;
      }

      if (sanitiseBody.isRequested) {
        return next(new APIError("You have already requested for Editor.", httpStatus.BAD_REQUEST, true));
      }
  
      const user = await User.findById(sanitiseBody._id);
      if (!user) {
        return next(new APIError("User not found.", httpStatus.NOT_FOUND, true));
      }
      user.isRequested = true;
      await user.save();
  
      let htmlContent = `<h2>Dear admin,\n\nPlease approve this user as Editor. Email: ${user.email}.</h2>`;
      await sendMail({ email: sanitiseBody.email, subject: "Application for Editor", bodyHtml: htmlContent });
      res.status(httpStatus.OK).json({ success: true, message: "Email sent to admin! Please wait until we processed your request." });
    } catch (error) {
      next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
  };

  const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let sanitiseBody: any = {};
      for (const key in req.body) {
        const unsafeValue = req.body[key];
        const safeValue = await sanitiseReqBody(unsafeValue); // Assume sanitiseReqBody is typed to return any
        sanitiseBody[key] = safeValue;
      }
      const { email } = sanitiseBody;
  
      const user = await User.findOne({ email });
      if (!user) {
        return next(new APIError("Invalid Email", httpStatus.BAD_REQUEST, true));
      }
  
      const otp = generateOTP(); // Ensure this function is typed to return a number
      user.otp = Number(otp);
      user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
  
      await user.save();
  
      const htmlContent = await ejs.renderFile(
        path.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"),
        { otp }
      );
  
      await sendMail({ email: sanitiseBody.email, subject: "Request for Resetting Password", bodyHtml: htmlContent });
      return res.status(httpStatus.OK).json({ success: true, message: `OTP sent to ${email}` });
    } catch (error) {
      return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
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
      const { otp, newPassword } = sanitiseBody;
  
      const user = await User.findOne({
        otp: otp,
        otp_expiry: { $gt: new Date() }
      });
  
      if (!user) {
        return next(new APIError("OTP Invalid or has expired.", httpStatus.BAD_REQUEST, true));
      }
  
      const encryptedPassword = await encryptPassword(newPassword); 
      user.otp = null;
      user.otp_expiry = null;
      await user.save();
  
      res.status(httpStatus.OK).json({ success: true, message: "Password Changed Successfully" });
    } catch (error) {
      return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
  };

export {
    register,
    verify,
    login,
    logout,
    getMyProfile,
    updateProfile,
    updatePassword,
    forgetPassword,
    resetPassword,
    reSendOtp,
    applyForReporter
  };