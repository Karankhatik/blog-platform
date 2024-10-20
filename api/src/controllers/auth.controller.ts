import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin.model";
import User from "../models/users.model";
import { decryptPassword } from "../utils/comman";
import sanitiseReqBody from "../helpers/sanetize";
import * as httpStatus from "http-status";
import ApiError from "../utils/APIError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import { options } from "../utils/types";

const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const admin = await Admin.findById(userId);

        if (!admin) {
            const user = await User.findById(userId);

            if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } else {
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();

            admin.refreshToken = refreshToken;
            await admin.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        }
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while generating refresh and access tokens"
        );
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const incomingAcessToken =
        req.cookies.accessToken || req.headers["acessToken"];

    let decodedToken = jwt.decode(incomingAcessToken) as TokenPayload;

    if (!incomingAcessToken) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Session expired"));
    }

    type TokenPayload = {
        _id: string;
    };

    try {       

        if (!decodedToken) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Session expired"));
        }

        // Check if the token belongs to an admin or a user
        const admin = await Admin.findById(decodedToken._id).catch((err) =>
            next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message))
        );
        const user = admin
            ? null
            : await User.findById(decodedToken._id).catch((err) =>
                next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message))
            );

        const tokenOwner = admin || user;

        let checkUserSession = null;
        if(tokenOwner) {
            try {
                checkUserSession = jwt.verify(
                    tokenOwner?.refreshToken,
                    process.env.REFRESH_TOKEN_SECRET as string
                ) as TokenPayload;
            } catch(error){
                new ApiError(httpStatus.UNAUTHORIZED, "Refresh token expired or used");
            }            
        }

        const tokenID = String(tokenOwner?._id);

        if (tokenID) {
            // Generate new tokens
            const { accessToken, refreshToken } =
                await generateAccessAndRefereshTokens(tokenID);
            // Send the new tokens back
            return res
                .status(httpStatus.OK)
                .cookie("accessToken", accessToken, options)                
                .json({
                    success: true,
                    message: "Access token refreshed",
                    accessToken
                });
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Jwt expired"));
        }
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token"));
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Sanitize each input
        const email = await sanitiseReqBody(req.body.email);
        const password = await sanitiseReqBody(req.body.password);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            const user = await User.findOne({ email: email }).select("+password");
            if (!user) {
                return next(new ApiError(httpStatus.NOT_FOUND, "User not found"));
            }
            const isMatched = await decryptPassword(password, user.password);

            if (!isMatched) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid password.",
                });
            }
            const userID = String(user._id);

            if (userID) {
                const { accessToken} =
                    await generateAccessAndRefereshTokens(userID);

                if (user.verified) {
                    return res
                        .status(httpStatus.OK)
                        .cookie("accessToken", accessToken, options)
                        .json({
                            success: true,
                            message: "Logged in successfully",
                            user: {
                                name: user.name,
                                isEditor: user?.isEditor,
                                isRequested: user?.isRequested,
                                email: user.email,
                                id: user._id,
                            },
                            accessToken
                        });
                } else {
                    return res.status(httpStatus.NOT_FOUND).json({
                        success: false,
                        message: "Please register your account first",
                    });
                }
            }
        }

        if (admin) {
            const isPasswordValid = await decryptPassword(password, admin.password);

            if (!isPasswordValid) {
                return next(
                    new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials")
                );
            }

            const adminID = String(admin._id);

            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(adminID ? adminID : "");

            const loggedInAdmin = await Admin.findById(admin._id).select(
                "-password -refreshToken"
            );

            return res
                .status(httpStatus.OK)
                .cookie("accessToken", accessToken, options)                
                .json({
                    success: true,
                    message: "Logged in successfully",
                    user: {
                        name: loggedInAdmin?.name,
                        isAdmin: loggedInAdmin?.isAdmin,
                        id: loggedInAdmin?._id,
                    },
                    accessToken
                });
        }
    } catch (error: any) {
        console.log(error);
        throw next(
            new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User not found")
        );
    }
};

export const logout = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.admin) {
            const admin = await Admin.findByIdAndUpdate(
                req.admin._id,
                {
                    $unset: {
                        refreshToken: 1,
                    },
                },
                {
                    new: true,
                }
            );

            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({ success: true, message: "Logged out successfully" });
        } else if (req.user) {
            const user = await User.findByIdAndUpdate(
                req.user._id,
                {
                    $unset: {
                        refreshToken: 1,
                    },
                },
                {
                    new: true,
                }
            );

            return res
                .status(200)
                .clearCookie("accessToken", options)                
                .json({ success: true, message: "Logged out successfully" });
        }
    } catch (error: any) {
        console.log(error);
        throw next(
            new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User not found")
        );
    }
};
