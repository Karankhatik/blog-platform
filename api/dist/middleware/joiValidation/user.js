"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = exports.userParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const userParamValidation = {
    register: joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().lowercase().email().required(),
        password: joi_1.default.string().min(6).required(),
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().lowercase().email().required(),
        password: joi_1.default.string().required()
    }),
    verify: joi_1.default.object({
        otp: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().lowercase().email().required(),
    }),
    forgetPassword: joi_1.default.object({
        email: joi_1.default.string().lowercase().email().required(),
    }),
    resetPassword: joi_1.default.object({
        otp: joi_1.default.string().min(3).required(),
        newPassword: joi_1.default.string().min(6).required(),
    }),
    updatePassword: joi_1.default.object({
        newPassword: joi_1.default.string().min(6).required(),
    }),
    updateProfile: joi_1.default.object({
        name: joi_1.default.string(),
        profileImage: joi_1.default.string()
    })
};
exports.userParamValidation = userParamValidation;
const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            const errorMessage = validation.error.details[0].message;
            return res.status(400).json({ error: errorMessage });
        }
        next();
    };
};
exports.validateMiddleware = validateMiddleware;
