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
exports.deleteArticle = exports.updateArticle = exports.getArticleBySlug = exports.getArticleById = exports.getAllArticles = exports.getAllArticlesForEditor = exports.createArticle = void 0;
const article_model_1 = __importDefault(require("../models/article.model"));
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = new article_model_1.default(req.body);
        yield article.save();
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Article created successfully',
            data: article
        });
    }
    catch (error) {
        next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
});
exports.createArticle = createArticle;
const getAllArticlesForEditor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        // Set up search filters based on conditions
        const searchFilters = {};
        // Add user filter if req.user exists        
        if (req === null || req === void 0 ? void 0 : req.user) {
            console.log(req.user._id);
            searchFilters.userId = req.user._id;
        }
        // Add title filter if provided
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title,
                $options: "i",
            };
        }
        // Query for articles with filters, sorting, pagination, and user population
        const articles = yield article_model_1.default.find(searchFilters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: "userId", select: "name" });
        // Get the total count of filtered articles
        const totalCount = yield article_model_1.default.countDocuments(searchFilters);
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Articles found!",
            articles,
            count: articles.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    }
    catch (error) {
        console.log("Error fetching articles:", error);
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching Articles");
    }
});
exports.getAllArticlesForEditor = getAllArticlesForEditor;
const getAllArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const searchFilters = {};
        let article = [];
        let totalCount;
        // Search query parameter
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title,
                $options: "i",
            };
            article = yield article_model_1.default.find(searchFilters)
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "userId", select: "name" });
            totalCount = yield article_model_1.default.countDocuments(searchFilters);
        }
        else {
            article = yield article_model_1.default.find()
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "userId", select: "name" });
            totalCount = yield article_model_1.default.countDocuments();
        }
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Article found!",
            articles: article,
            count: article.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching Articles");
    }
});
exports.getAllArticles = getAllArticles;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield article_model_1.default.findById(req.params.id);
        if (!article) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Article not found' });
        }
        res.json({ success: true, data: article });
    }
    catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
});
exports.getArticleById = getArticleById;
const getArticleBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield article_model_1.default.findOne({ slug: req.params.slug })
            .populate({ path: "userId", select: "name" }) // Populate userId with name
            .exec();
        if (!article) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Article not found' });
        }
        res.json({ success: true, data: article });
    }
    catch (error) {
        console.log("error", error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
});
exports.getArticleBySlug = getArticleBySlug;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { content, } = req.body;
        const { title, draftStage, slug, description, feedbacks, articleImage } = sanitiseBody;
        const article = yield article_model_1.default.findById({
            _id: req.params.id,
        });
        if (!article) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "User not found"));
        }
        article.content = content ? content : article.content;
        article.title = title ? title : article.title;
        article.draftStage = draftStage ? draftStage : article.draftStage;
        article.slug = slug ? slug : article.slug;
        article.description = description ? description : article.description;
        article.feedbacks = feedbacks ? feedbacks : article.feedbacks;
        article.articleImage = articleImage ? articleImage : article.articleImage;
        yield article.save();
        res.status(httpStatus.OK).json({
            success: true,
            message: "article updated successfully",
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while updating Articles");
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield article_model_1.default.findByIdAndDelete(req.params.id);
        if (!article) {
            return res
                .status(404)
                .json({ success: false, message: "article not found" });
        }
        res.status(httpStatus.OK).json({
            success: true,
            message: "article deleted successfully",
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while deleting Articles");
    }
});
exports.deleteArticle = deleteArticle;
