"use strict";
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
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const users_model_1 = __importDefault(require("../models/users.model"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['access-token'];
    console.log(accessToken);
    let token = req.cookies.accessToken || accessToken;
    // console.log("token --> ", token);
    // Check token
    if (!token) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized request" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield users_model_1.default.findOne({ email: decoded.email }).select("-password -refreshToken");
        if (!user) {
            const admin = yield admin_model_1.default.findOne({ email: decoded.email }).select("-password -refreshToken");
            if (!admin) {
                return res.status(http_status_1.default.FORBIDDEN).json({ success: false, message: "Invalid Access Token" });
            }
            req.admin = admin;
            next();
        }
        else {
            req.user = user;
            next();
        }
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.UNAUTHORIZED).json({ success: false, message: "jwt expired" });
    }
});
exports.protect = protect;
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const admin = req.admin;
    if (((user === null || user === void 0 ? void 0 : user.isEditor) && (user === null || user === void 0 ? void 0 : user.verified)) || ((admin === null || admin === void 0 ? void 0 : admin.isAdmin) && (admin === null || admin === void 0 ? void 0 : admin.verified))) {
        next();
    }
    else {
        const message = "You can't access this please login!";
        return res.status(http_status_1.default.UNAUTHORIZED).json({ success: false, message: message });
    }
});
exports.authorize = authorize;
