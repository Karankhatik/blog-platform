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
const chapterController = __importStar(require("../controllers/chapters.controller"));
const chapter_validation_1 = require("../middleware/joiValidation/chapter.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.protect, auth_middleware_2.authorize, (0, chapter_validation_1.validateChapterMiddleware)(chapter_validation_1.chapterParamValidation.createChapter), chapterController.createChapter);
router.get('/', auth_middleware_1.protect, chapterController.getAllChapters);
router.get('/:id', auth_middleware_1.protect, chapterController.getChapterById);
router.put('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, (0, chapter_validation_1.validateChapterMiddleware)(chapter_validation_1.chapterParamValidation.updateChapter), chapterController.updateChapter);
router.delete('/:id', auth_middleware_1.protect, auth_middleware_2.authorize, chapterController.deleteChapter);
exports.default = router;
