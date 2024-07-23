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
exports.validateCourseMiddleware = exports.courseParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../../utils/APIError"));
const courseParamValidation = {
    createCourse: joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        // Assuming userId is a string; adjust as necessary for your ObjectId validation if needed
    }),
    updateCourse: joi_1.default.object({
        title: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
    })
};
exports.courseParamValidation = courseParamValidation;
const validateCourseMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            return next(new APIError_1.default(httpStatus.BAD_REQUEST, errorMessage));
        }
        next();
    };
};
exports.validateCourseMiddleware = validateCourseMiddleware;
