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
exports.applyForReporter = exports.reSendOtp = exports.resetPassword = exports.forgetPassword = exports.updatePassword = exports.updateProfile = exports.getMyProfile = exports.logout = exports.login = exports.verify = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_1 = __importDefault(require("../models/users"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const comman_1 = require("../utils/comman");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        let user = yield users_1.default.findOne({ email: sanitiseBody.email });
        if (user && user.verified) {
            res.status(http_status_1.default.CONFLICT).json({
                success: false,
                message: "User already exists",
            });
        }
        if (user && !user.verified) {
            yield users_1.default.findByIdAndDelete(user._id);
        }
        let encryptedPassword = yield (0, comman_1.encryptPassword)(sanitiseBody.password);
        const otp = (0, comman_1.generateOTP)();
        sanitiseBody.password = encryptedPassword;
        sanitiseBody.otp = otp;
        sanitiseBody.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
        //let htmlContent = await ejs.renderFile(path.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"), { otp });
        user = yield users_1.default.create({
            name: sanitiseBody.name,
            email: sanitiseBody.email,
            password: sanitiseBody.password,
            otp: sanitiseBody.otp,
            otp_expiry: sanitiseBody.otp_expiry,
        });
        yield (0, sendMail_1.default)({ email: sanitiseBody.email, subject: "Email Verification", bodyHtml: `Please check your mail and verify the otp ${otp}` });
        //let token = generateJWTAccessToken(user);
        let resMessage = "OTP sent to your email, please verify your account";
        sanitiseBody.password = null;
        sanitiseBody.otp = null;
        res.status(http_status_1.default.CREATED).json({ success: true, message: resMessage, user: user });
    }
    catch (error) {
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
        const user = yield users_1.default.findOne({ email: sanitiseBody.email });
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
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const user = yield users_1.default.findOne({ email: sanitiseBody.email }).select("+password");
        if (!user) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Invalid user Email.",
            });
        }
        const isMatched = yield (0, comman_1.decryptPassword)(sanitiseBody.password, user.password);
        if (!isMatched) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Invalid user Password.",
            });
        }
        let token = (0, comman_1.generateJWTAccessToken)(user);
        if (user.verified) {
            res.status(http_status_1.default.OK).json({ success: true, message: "User logged in successfully", user, token });
        }
        else {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Please register your account first",
            });
        }
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, sanetize_1.default)(req.body._id);
        const user = yield users_1.default.findById(id);
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }
        res
            .status(http_status_1.default.OK)
            .cookie("token", null, {
            expires: new Date(Date.now())
        })
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});
exports.logout = logout;
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, sanetize_1.default)(req.body.email);
        const user = yield users_1.default.findById(id);
        if (!user) {
            return next(new APIError_1.default("Invalid User!.", http_status_1.default.BAD_REQUEST, true));
        }
        res.status(http_status_1.default.OK).json({ success: true, message: `Welcome back ${user.name}`, user });
    }
    catch (error) {
        return next(new APIError_1.default("Request failed. Please check your request and try again.", http_status_1.default.BAD_REQUEST, true));
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
        const user = yield users_1.default.findById(sanitiseBody._id);
        if (!user) {
            return next(new APIError_1.default("Invalid User!.", http_status_1.default.BAD_REQUEST, true));
        }
        user.name = sanitiseBody.name;
        user.profileImage = sanitiseBody.profileImage;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Profile Updated successfully" });
    }
    catch (error) {
        return next(new APIError_1.default("Request failed. Please check your request and try again..", http_status_1.default.BAD_REQUEST, true));
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
        const user = yield users_1.default.findById(sanitiseBody._id);
        if (!user) {
            return next(new APIError_1.default("Invalid User!.", http_status_1.default.BAD_REQUEST, true));
        }
        let encryptedPassword = yield (0, comman_1.encryptPassword)(sanitiseBody.password);
        user.password = encryptedPassword;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Password Updated successfully" });
    }
    catch (error) {
        return next(new APIError_1.default("Request failed. Please check your request and try again.", http_status_1.default.BAD_REQUEST, true));
    }
});
exports.updatePassword = updatePassword;
const reSendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = yield (0, sanetize_1.default)(req.body.email);
        const user = yield users_1.default.findOne({ email: email });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }
        const otp = (0, comman_1.generateOTP)();
        user.otp = Number(otp);
        user.otp_expiry = new Date(Date.now() + Number(process.env.OTP_EXPIRE) * 60 * 1000);
        yield user.save();
        // let htmlContent = await ejs.renderFile(
        //   path.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"),
        //   { otp }
        // );
        yield (0, sendMail_1.default)({ email: email, subject: "Resend OTP", bodyHtml: `otp sended ${otp}` });
        res.status(http_status_1.default.OK).json({ success: true, message: `OTP sent to ${email}` });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.reSendOtp = reSendOtp;
const applyForReporter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        if (sanitiseBody.isRequested) {
            return next(new APIError_1.default("You have already requested for Editor.", http_status_1.default.BAD_REQUEST, true));
        }
        const user = yield users_1.default.findById(sanitiseBody._id);
        if (!user) {
            return next(new APIError_1.default("User not found.", http_status_1.default.NOT_FOUND, true));
        }
        user.isRequested = true;
        yield user.save();
        let htmlContent = `<h2>Dear admin,\n\nPlease approve this user as Editor. Email: ${user.email}.</h2>`;
        yield (0, sendMail_1.default)({ email: sanitiseBody.email, subject: "Application for Editor", bodyHtml: htmlContent });
        res.status(http_status_1.default.OK).json({ success: true, message: "Email sent to admin! Please wait until we processed your request." });
    }
    catch (error) {
        next(new APIError_1.default("Request failed. Please check your request and try again.", http_status_1.default.BAD_REQUEST, true));
    }
});
exports.applyForReporter = applyForReporter;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = yield (0, sanetize_1.default)(unsafeValue); // Assume sanitiseReqBody is typed to return any
            sanitiseBody[key] = safeValue;
        }
        const { email } = sanitiseBody;
        const user = yield users_1.default.findOne({ email });
        if (!user) {
            return next(new APIError_1.default("Invalid Email", http_status_1.default.BAD_REQUEST, true));
        }
        const otp = (0, comman_1.generateOTP)(); // Ensure this function is typed to return a number
        user.otp = Number(otp);
        user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
        yield user.save();
        const htmlContent = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../emailTemplate/otpSendToEmailForSignUp.ejs"), { otp });
        yield (0, sendMail_1.default)({ email: sanitiseBody.email, subject: "Request for Resetting Password", bodyHtml: htmlContent });
        return res.status(http_status_1.default.OK).json({ success: true, message: `OTP sent to ${email}` });
    }
    catch (error) {
        return next(new APIError_1.default("Request failed. Please check your request and try again.", http_status_1.default.BAD_REQUEST, true));
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
        const { otp, newPassword } = sanitiseBody;
        const user = yield users_1.default.findOne({
            otp: otp,
            otp_expiry: { $gt: new Date() }
        });
        if (!user) {
            return next(new APIError_1.default("OTP Invalid or has expired.", http_status_1.default.BAD_REQUEST, true));
        }
        const encryptedPassword = yield (0, comman_1.encryptPassword)(newPassword);
        user.otp = null;
        user.otp_expiry = null;
        yield user.save();
        res.status(http_status_1.default.OK).json({ success: true, message: "Password Changed Successfully" });
    }
    catch (error) {
        return next(new APIError_1.default("Request failed. Please check your request and try again.", http_status_1.default.BAD_REQUEST, true));
    }
});
exports.resetPassword = resetPassword;
