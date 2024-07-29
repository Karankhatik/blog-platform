"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        ref: 'User'
    },
    courseSlug: {
        type: String,
        lowercase: true,
        trim: true
    },
}, { timestamps: true });
const Course = (0, mongoose_1.model)('Course', CourseSchema);
exports.default = Course;
