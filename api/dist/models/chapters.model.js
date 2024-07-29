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
    },
    chapterSlug: {
        type: String,
        lowercase: true,
        trim: true
    },
    userId: {
        type: String,
        ref: 'User'
    },
    metaDescription: {
        type: String
    },
    keyPhrase: {
        type: String
    },
    tags: {
        type: [String]
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course'
    },
    feedbacks: {
        type: [String]
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Chapter', ChapterSchema);
