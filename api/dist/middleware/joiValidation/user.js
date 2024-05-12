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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = exports.userParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../../utils/APIError"));
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
        email: joi_1.default.string().lowercase().email().required(),
        otp: joi_1.default.number().min(6).required(),
    }),
    forgetPassword: joi_1.default.object({
        email: joi_1.default.string().lowercase().email().required(),
    }),
    resetPassword: joi_1.default.object({
        otp: joi_1.default.number().min(6).required(),
        newPassword: joi_1.default.string().min(6).required(),
        email: joi_1.default.string().lowercase().email().required(),
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
        console.log("gnghjghjgh");
        if (validation.error) {
            console.log(validation.error);
            const errorMessage = validation.error.details[0].message;
            throw next(new APIError_1.default(httpStatus.NO_CONTENT, errorMessage));
        }
        next();
    };
};
exports.validateMiddleware = validateMiddleware;
