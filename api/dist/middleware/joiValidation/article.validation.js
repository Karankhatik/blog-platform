"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArticleMiddleware = exports.articleParamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_1 = __importDefault(require("http-status"));
const APIError_1 = __importDefault(require("../../utils/APIError"));
const articleParamValidation = {
    createArticle: joi_1.default.object({
        title: joi_1.default.string().required(),
        content: joi_1.default.string().allow(''),
        userId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId format
        slug: joi_1.default.string().optional(),
        description: joi_1.default.string().allow(''),
    }),
    updateArticle: joi_1.default.object({
        title: joi_1.default.string().optional(),
        content: joi_1.default.string().allow(''),
        slug: joi_1.default.string(),
        description: joi_1.default.string().allow(''),
        feedbacks: joi_1.default.array().items(joi_1.default.string()),
        draftStage: joi_1.default.boolean()
    })
};
exports.articleParamValidation = articleParamValidation;
const validateArticleMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            return next(new APIError_1.default(http_status_1.default.BAD_REQUEST, errorMessage));
        }
        next();
    };
};
exports.validateArticleMiddleware = validateArticleMiddleware;
