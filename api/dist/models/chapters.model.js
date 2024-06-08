"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Chapter.ts
const mongoose_1 = require("mongoose");
const ChapterSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course'
    }
});
exports.default = (0, mongoose_1.model)('Chapter', ChapterSchema);
