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
exports.deleteChapter = exports.updateChapter = exports.getChapterById = exports.getAllChapters = exports.createChapter = void 0;
const chapters_model_1 = __importDefault(require("../models/chapters.model"));
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const createChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = new chapters_model_1.default(req.body);
        yield chapter.save();
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Chapter created successfully',
            data: chapter
        });
    }
    catch (error) {
        next(new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
});
exports.createChapter = createChapter;
const getAllChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const searchFilters = {};
        let chapter = [];
        let totalCount;
        // Search query parameter
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title,
                $options: "i",
            };
            chapter = yield chapters_model_1.default.find(searchFilters)
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalCount = yield chapters_model_1.default.countDocuments(searchFilters);
        }
        else {
            chapter = yield chapters_model_1.default.find()
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalCount = yield chapters_model_1.default.countDocuments();
        }
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Chapter found!",
            chapters: chapter,
            count: chapter.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching Chapters");
    }
});
exports.getAllChapters = getAllChapters;
const getChapterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = yield chapters_model_1.default.findById(req.params.id);
        if (!chapter) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Chapter not found' });
        }
        res.json({ success: true, data: chapter });
    }
    catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
});
exports.getChapterById = getChapterById;
const updateChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { title, content, courseId } = sanitiseBody;
        const chapter = yield chapters_model_1.default.findById({
            _id: req.params.id,
        });
        if (!chapter) {
            return next(new APIError_1.default(httpStatus.UNAUTHORIZED, "User not found"));
        }
        chapter.content = content ? content : chapter.content;
        chapter.title = title ? title : chapter.title;
        chapter.courseId = courseId ? courseId : chapter.courseId;
        yield chapter.save();
        res.status(httpStatus.OK).json({
            success: true,
            message: "chapter updated successfully",
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while updating chapters");
    }
});
exports.updateChapter = updateChapter;
const deleteChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = yield chapters_model_1.default.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res
                .status(404)
                .json({ success: false, message: "chapter not found" });
        }
        res.status(httpStatus.OK).json({
            success: true,
            message: "chapter deleted successfully",
        });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while deleting chapters");
    }
});
exports.deleteChapter = deleteChapter;
