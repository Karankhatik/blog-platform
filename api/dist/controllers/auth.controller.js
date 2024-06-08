"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.refreshAccessToken = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const comman_1 = require("../utils/comman");
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
const types_1 = require("../utils/types");
const generateAccessAndRefereshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_model_1.default.findById(userId);
        if (!admin) {
            const user = yield users_model_1.default.findById(userId);
            if (!user)
                throw new APIError_1.default(httpStatus.NOT_FOUND, "User not found");
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            user.refreshToken = refreshToken;
            yield user.save({ validateBeforeSave: false });
            return { accessToken, refreshToken };
        }
        else {
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();
            admin.refreshToken = refreshToken;
            yield admin.save({ validateBeforeSave: false });
            return { accessToken, refreshToken };
        }
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while generating refresh and access tokens");
    }
});
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.headers["refreshToken"];
    if (!incomingRefreshToken) {
        return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Session expired"));
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Invalid refresh token"));
        }
        // Check if the token belongs to an admin or a user
        const admin = yield admin_model_1.default.findById(decodedToken._id).catch(err => next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, err.message)));
        const user = admin ? null : yield users_model_1.default.findById(decodedToken._id).catch(err => next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, err.message)));
        const tokenOwner = admin || user;
        if (!tokenOwner || incomingRefreshToken !== tokenOwner.refreshToken) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Refresh token expired or used"));
        }
        // Generate new tokens
        const { accessToken, refreshToken } = yield generateAccessAndRefereshTokens(tokenOwner._id.toString());
        // Send the new tokens back
        return res
            .status(httpStatus.OK)
            .cookie("accessToken", accessToken, types_1.options)
            .cookie("refreshToken", refreshToken, types_1.options)
            .json({
            success: true,
            message: "Access token refreshed",
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_2.TokenExpiredError) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Jwt expired"));
        }
        return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Invalid refresh token"));
    }
});
exports.refreshAccessToken = refreshAccessToken;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sanitize each input
        const email = yield (0, sanetize_1.default)(req.body.email);
        const password = yield (0, sanetize_1.default)(req.body.password);
        const admin = yield admin_model_1.default.findOne({ email });
        if (!admin) {
            const user = yield users_model_1.default.findOne({ email: email }).select("+password");
            if (!user) {
                return next(new APIError_1.default(httpStatus.NOT_FOUND, "User not found"));
            }
            const isMatched = yield (0, comman_1.decryptPassword)(password, user.password);
            if (!isMatched) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid password.",
                });
            }
            const { accessToken, refreshToken } = yield generateAccessAndRefereshTokens(user._id);
            if (user.verified) {
                return res
                    .status(httpStatus.OK)
                    .cookie("accessToken", accessToken, types_1.options)
                    .cookie("refreshToken", refreshToken, types_1.options)
                    .json({
                    success: true,
                    message: "Logged in successfully",
                    user: {
                        name: user.name,
                        isEditor: user === null || user === void 0 ? void 0 : user.isEditor,
                        isRequested: user === null || user === void 0 ? void 0 : user.isRequested,
                        email: user.email,
                        id: user._id
                    },
                    accessToken,
                    refreshToken
                });
            }
            else {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Please register your account first",
                });
            }
        }
        const isPasswordValid = yield (0, comman_1.decryptPassword)(password, admin.password);
        if (!isPasswordValid) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "Invalid credentials"));
        }
        const { accessToken, refreshToken } = yield generateAccessAndRefereshTokens(admin._id);
        const loggedInAdmin = yield admin_model_1.default.findById(admin._id).select("-password -refreshToken");
        return res
            .status(httpStatus.OK)
            .cookie("accessToken", accessToken, types_1.options)
            .cookie("refreshToken", refreshToken, types_1.options)
            .json({
            success: true,
            message: "Logged in successfully",
            user: {
                name: loggedInAdmin === null || loggedInAdmin === void 0 ? void 0 : loggedInAdmin.name,
                isAdmin: loggedInAdmin === null || loggedInAdmin === void 0 ? void 0 : loggedInAdmin.isAdmin,
                id: loggedInAdmin === null || loggedInAdmin === void 0 ? void 0 : loggedInAdmin._id
            }
        });
    }
    catch (error) {
        console.log(error);
        throw next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "User not found"));
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.admin) {
            const admin = yield admin_model_1.default.findByIdAndUpdate(req.admin._id, {
                $unset: {
                    refreshToken: 1
                }
            }, {
                new: true
            });
            return res
                .status(200)
                .clearCookie("accessToken", types_1.options)
                .clearCookie("refreshToken", types_1.options)
                .json({ success: true, message: "Logged out successfully" });
        }
        else if (req.user) {
            const user = yield users_model_1.default.findByIdAndUpdate(req.user._id, {
                $unset: {
                    refreshToken: 1
                }
            }, {
                new: true
            });
            return res
                .status(200)
                .clearCookie("accessToken", types_1.options)
                .clearCookie("refreshToken", types_1.options)
                .json({ success: true, message: "Logged out successfully" });
        }
    }
    catch (error) {
        console.log(error);
        throw next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "User not found"));
    }
});
exports.logout = logout;
