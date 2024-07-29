"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChapterMiddleware = exports.chapterParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_1 = __importDefault(require("http-status"));
const APIError_1 = __importDefault(require("../../utils/APIError"));
const chapterParamValidation = {
    createChapter: joi_1.default.object({
        title: joi_1.default.string().required(),
        content: joi_1.default.string().allow(''),
        userId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId format
        courseId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        chapterSlug: joi_1.default.string().optional(),
        metaDescription: joi_1.default.string().allow(''),
        keyPhrase: joi_1.default.string().allow(''),
        tags: joi_1.default.array().items(joi_1.default.string())
    }),
    updateChapter: joi_1.default.object({
        title: joi_1.default.string().optional(),
        content: joi_1.default.string().allow(''),
        courseId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        chapterSlug: joi_1.default.string(),
        metaDescription: joi_1.default.string().allow(''),
        keyPhrase: joi_1.default.string().allow(''),
        tags: joi_1.default.array().items(joi_1.default.string())
    })
};
exports.chapterParamValidation = chapterParamValidation;
const validateChapterMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            return next(new APIError_1.default(http_status_1.default.BAD_REQUEST, errorMessage));
        }
        next();
    };
};
exports.validateChapterMiddleware = validateChapterMiddleware;
