import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import User from '../models/users.model';
import Admin from '../models/admin.model';
import { TokenPayload, AuthRequest } from '../utils/types';





const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const accessToken = req.headers['access-token'];
  console.log(accessToken)
  let token = req.cookies.accessToken || accessToken;
  // Check token
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized request" });
  }

  try {

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as TokenPayload;

    const user = await User.findOne({ email: decoded.email }).select("-password -refreshToken");
    if (!user) {
      const admin = await Admin.findOne({ email: decoded.email }).select("-password -refreshToken");
      if (!admin) {
        return res.status(httpStatus.FORBIDDEN).json({ success: false, message: "Invalid Access Token" });
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

  if ((user?.isEditor && user?.verified) || (admin?.isAdmin)) {
    next();
  } else {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Access denied!" });
  }
}
 
export { protect, authorize };
