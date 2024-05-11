import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import User from '../models/users'; // Adjust according to actual export
import Admin from '../models/admin'; // Adjust according to actual export

// Define a type for your token payload if you expect more fields.
interface TokenPayload extends JwtPayload {
  email: string; // Assuming `email` is a guaranteed field in your tokens.
}

interface AuthRequest extends Request {
  user?: any;  // Define the User type based on your User model
  admin?: any;  // Define the Admin type based on your Admin model
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  let message = "jwt expired";

  token = req.cookies.accessToken || req.body.accessToken || req.headers["accessToken"];
  // Check token
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: message });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as TokenPayload;
   
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      const admin = await Admin.findOne({ email: decoded.email });
      if (!admin) {
        message = "The user belonging to this token does not exist.";
        return res.status(httpStatus.FORBIDDEN).json({ success: false, message: message });
      }
      req.admin = admin;
      next();
    } else {
      req.user = user;
      next();
    }
  } catch (error: any) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "jwt expired" });
  }
};

const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const admin = req.admin;

  if ((user?.isReporter && user?.verified) || (admin?.isAdmin && admin?.verified)) {
    next();
  } else {
    const message = "You can't access this please login!";
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: message });
  }
}

export { protect, authorize };
