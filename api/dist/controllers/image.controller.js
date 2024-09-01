"use strict";
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
exports.saveImage = exports.getImages = void 0;
const image_model_1 = __importDefault(require("../models/image.model"));
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield image_model_1.default.find().sort({ created_at: -1 });
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.getImages = getImages;
const saveImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, url, view_url, created_at } = req.body;
        if (!name || !url || !view_url || !created_at) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newImage = new image_model_1.default({
            name,
            url,
            view_url,
            created_at: new Date(created_at),
        });
        const savedImage = yield newImage.save();
        res.status(201).json(savedImage);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.saveImage = saveImage;
