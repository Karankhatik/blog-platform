"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true
    },
    userId: {
        type: String,
        ref: 'User'
    },
    description: {
        type: String,
        trim: true
    },
    feedbacks: {
        type: [String]
    },
    draftStage: {
        type: Boolean,
        default: true
    },
    articleImage: {
        type: String,
        trim: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Article', ArticleSchema);
