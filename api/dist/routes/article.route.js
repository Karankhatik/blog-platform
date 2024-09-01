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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController = __importStar(require("../controllers/articles.controller"));
const article_validation_1 = require("../middleware/joiValidation/article.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.protect, auth_middleware_2.authorize, (0, article_validation_1.validateArticleMiddleware)(article_validation_1.articleParamValidation.createArticle), articleController.createArticle);
router.get('/', auth_middleware_1.protect, articleController.getAllArticles);
router.get('/:id', auth_middleware_1.protect, articleController.getArticleById);
router.put('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, (0, article_validation_1.validateArticleMiddleware)(article_validation_1.articleParamValidation.updateArticle), articleController.updateArticle);
router.delete('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, articleController.deleteArticle);
exports.default = router;
