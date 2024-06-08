"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = exports.adminParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const adminParamValidation = {
    register: joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().lowercase().email().required(),
        password: joi_1.default.string().min(6).required(),
        isAdmin: joi_1.default.boolean().valid(0, 1, true, false).required(),
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().lowercase().email().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.adminParamValidation = adminParamValidation;
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
