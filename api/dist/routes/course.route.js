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
const courseController = __importStar(require("../controllers/course.controller")); //import { userParamValidation, validateMiddleware } from '../middleware/joiValidation/user';
const auth_middleware_1 = require("../middleware/auth.middleware");
const course_validation_1 = require("../middleware/joiValidation/course.validation");
const auth_middleware_2 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.protect, auth_middleware_2.authorize, (0, course_validation_1.validateCourseMiddleware)(course_validation_1.courseParamValidation.createCourse), courseController.createCourse); // Create a new course
router.get('/', courseController.getAllCourses); // Get all courses
router.get('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, courseController.getCourseById); // Get a specific course by id
router.put('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, (0, course_validation_1.validateCourseMiddleware)(course_validation_1.courseParamValidation.updateCourse), courseController.updateCourse); // Update a specific course
router.delete('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, courseController.deleteCourse); // Delete a specific course
exports.default = router;
