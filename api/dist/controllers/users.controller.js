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
exports.applyForEditor = exports.reSendOtp = exports.resetPassword = exports.forgetPassword = exports.updatePassword = exports.updateProfile = exports.getMyProfile = exports.verify = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_model_1 = __importDefault(require("../models/users.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const comman_1 = require("../utils/comman");
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const otpSendToEmailForSignUp_1 = require("../emailTemplate/otpSendToEmailForSignUp");
const otpSendToEmailForResetPassword_1 = require("../emailTemplate/otpSendToEmailForResetPassword");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        let user = yield users_model_1.default.findOne({ email: sanitiseBody.email });
        if (user && user.verified) {
            return res.status(http_status_1.default.CONFLICT).json({
                success: false,
                message: "User already exists",
            });
        }
        if (user && !user.verified) {
            yield users_model_1.default.findByIdAndDelete(user._id);
        }
        let encryptedPassword = yield (0, comman_1.encryptPassword)(sanitiseBody.password);
        const otp = (0, comman_1.generateOTP)();
        sanitiseBody.password = encryptedPassword;
        sanitiseBody.otp = otp;
        sanitiseBody.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
        let htmlContent = yield (0, otpSendToEmailForSignUp_1.otpSendToEmailForSignUp)(sanitiseBody.otp);
        user = yield users_model_1.default.create({
            name: sanitiseBody.name,
            email: sanitiseBody.email,
            password: sanitiseBody.password,
            otp: sanitiseBody.otp,
            otp_expiry: sanitiseBody.otp_expiry,
        });
        yield (0, sendMail_1.default)({ email: sanitiseBody.email, subject: "Email Verification - Intake Learn", bodyHtml: htmlContent });
        let resMessage = "OTP sent to your email, please verify your account";
        sanitiseBody.password = null;
        sanitiseBody.otp = null;
        res.status(http_status_1.default.CREATED).json({ success: true, message: resMessage, user: user });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.register = register;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const otp = Number(sanitiseBody.otp);
        const user = yield users_model_1.default.findOne({ email: sanitiseBody.email });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.otp !== otp) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        if (user.otp_expiry && user.otp_expiry.getTime() < Date.now()) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "OTP has been expired",
            });
        }
        user.verified = true;
        user.otp = null;
        user.otp_expiry = null;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Account Verified", user: user });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.verify = verify;
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, sanetize_1.default)(req.body.email);
        const user = yield users_model_1.default.findById(id);
        if (!user) {
            return;
            //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
        }
        res.status(http_status_1.default.OK).json({ success: true, message: `Welcome back ${user.name}`, user });
    }
    catch (error) {
        //return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
});
exports.getMyProfile = getMyProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const user = yield users_model_1.default.findById(sanitiseBody._id);
        if (!user) {
            return;
            //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
        }
        user.name = sanitiseBody.name;
        user.profileImage = sanitiseBody.profileImage;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Profile Updated successfully" });
    }
    catch (error) {
        //return next(new APIError("Request failed. Please check your request and try again..", httpStatus.BAD_REQUEST, true));
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const user = yield users_model_1.default.findById(sanitiseBody._id);
        if (!user) {
            return;
            //return next(new APIError("Invalid User!.", httpStatus.BAD_REQUEST, true));
        }
        let encryptedPassword = yield (0, comman_1.encryptPassword)(sanitiseBody.password);
        user.password = encryptedPassword;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Password Updated successfully" });
    }
    catch (error) {
        //return next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
});
exports.updatePassword = updatePassword;
const reSendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = yield (0, sanetize_1.default)(req.body.email);
        const user = yield users_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }
        const otp = Number((0, comman_1.generateOTP)());
        user.otp = otp;
        user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
        yield user.save();
        let htmlContent = yield (0, otpSendToEmailForSignUp_1.otpSendToEmailForSignUp)(otp);
        yield (0, sendMail_1.default)({ email: email, subject: "Resend OTP - Intake Learn", bodyHtml: htmlContent });
        res.status(http_status_1.default.OK).json({ success: true, message: `OTP resent successfully` });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.reSendOtp = reSendOtp;
const applyForEditor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        if (sanitiseBody.isRequested) {
            return;
            // return next(new APIError("You have already requested for Editor.", httpStatus.BAD_REQUEST, true));
        }
        const user = yield users_model_1.default.findById(sanitiseBody._id);
        if (!user) {
            return;
            //return next(new APIError("User not found.", httpStatus.NOT_FOUND, true));
        }
        user.isRequested = true;
        yield user.save();
        let htmlContent = `<h2>Dear admin,\n\nPlease approve this user as Editor. Email: ${user.email}.</h2>`;
        yield (0, sendMail_1.default)({ email: sanitiseBody.email, subject: "Application for Editor", bodyHtml: htmlContent });
        res.status(http_status_1.default.OK).json({ success: true, message: "Email sent to admin! Please wait until we processed your request." });
    }
    catch (error) {
        //next(new APIError("Request failed. Please check your request and try again.", httpStatus.BAD_REQUEST, true));
    }
});
exports.applyForEditor = applyForEditor;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield (0, sanetize_1.default)(req.body.email);
        const user = yield users_model_1.default.findOne({ email });
        if (!user) {
            return next(new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Email"));
        }
        const otp = Number((0, comman_1.generateOTP)());
        user.otp = Number(otp);
        user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
        yield user.save();
        const htmlContent = yield (0, otpSendToEmailForResetPassword_1.otpSendToEmailForResetPassword)(otp);
        yield (0, sendMail_1.default)({ email: email, subject: "Request for Resetting Password", bodyHtml: htmlContent });
        return res.status(http_status_1.default.OK).json({ success: true, message: `OTP sent to your email, please verify your account` });
    }
    catch (error) {
        return next(new APIError_1.default(http_status_1.default.BAD_REQUEST, "Invalid Email"));
    }
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { otp, newPassword, email } = sanitiseBody;
        const user = yield users_model_1.default.findOne({ email });
        if (!user) {
            return next(new APIError_1.default(http_status_1.default.UNAUTHORIZED, "User not found"));
        }
        if (user.otp !== otp) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        if (user.otp_expiry && user.otp_expiry.getTime() < Date.now()) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "OTP has been expired",
            });
        }
        const encryptedPassword = yield (0, comman_1.encryptPassword)(newPassword);
        user.otp = null;
        user.otp_expiry = null;
        user.password = encryptedPassword;
        yield user.save();
        return res.status(http_status_1.default.OK).json({ success: true, message: "Password Changed Successfully" });
    }
    catch (error) {
        console.log(error);
        return next(new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Request failed. Please check your request and try again."));
    }
});
exports.resetPassword = resetPassword;
