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
  let message = "Not authorized to access this route.";

  // Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check token
  if (!token) {    
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: message });
  }

  try {
    // Use a type assertion here
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;
    
    // Now TypeScript knows `decoded` includes an `email` field
    const user = await User.findOne({email: decoded.email});
    if (!user) {
      const admin = await Admin.findOne({email: decoded.email});
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
  } catch (e:any) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: e.message });
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
