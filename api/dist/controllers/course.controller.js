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
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const httpStatus = __importStar(require("http-status"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitisedBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            // Assuming sanitiseReqBody is a function that sanitises input
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitisedBody[key] = safeValue;
        }
        console.log(sanitisedBody);
        const course = new course_model_1.default({
            title: sanitisedBody.title,
            description: sanitisedBody.description,
            userId: sanitisedBody.userId
        });
        yield course.save();
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    }
    catch (error) {
        console.log(error);
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while creating course");
    }
});
exports.createCourse = createCourse;
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.default.find();
        res.json({ success: true, data: courses });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching courses");
    }
});
exports.getAllCourses = getAllCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_model_1.default.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, data: course });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching courses");
    }
});
exports.getCourseById = getCourseById;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, data: course });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while updating courses");
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_model_1.default.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, message: "Course deleted successfully" });
    }
    catch (error) {
        throw new APIError_1.default(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while deleting courses");
    }
});
exports.deleteCourse = deleteCourse;
