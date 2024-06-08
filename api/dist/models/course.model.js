"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'User' // This reference indicates the model to which this ID relates
    },
    chapterIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Chapter'
        }]
});
const Course = (0, mongoose_1.model)('Course', CourseSchema);
exports.default = Course;
