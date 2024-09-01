"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
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
        type: String
    },
    feedbacks: {
        type: [String]
    },
    draftStage: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Article', ArticleSchema);
