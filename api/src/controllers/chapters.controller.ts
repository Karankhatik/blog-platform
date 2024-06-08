import { Request, Response, NextFunction } from 'express';
import Chapter from '../models/chapters.model';
import sanitiseReqBody from '../helpers/sanetize';
import * as httpStatus from "http-status";
import  ApiError  from "../utils/APIError";

export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chapter = new Chapter(req.body);
        await chapter.save();
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Chapter created successfully',
            data: chapter
        });
    } catch (error:any) {
        next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
};

export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const chapters = await Chapter.find();
        res.json({ success: true, data: chapters });
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
};

export const getChapterById = async (req: Request, res: Response) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Chapter not found' });
        }
        res.json({ success: true, data: chapter });
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
};

export const updateChapter = async (req: Request, res: Response) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!chapter) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Chapter not found' });
        }
        res.json({ success: true, data: chapter });
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
};

export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Chapter not found' });
        }
        res.json({ success: true, message: 'Chapter deleted successfully' });
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
};
