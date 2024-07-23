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
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;

        const skip = (page - 1) * limit;

        const searchFilters: any = {};
        let chapter: any = [];
        let totalCount: number;

        // Search query parameter
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title as string,
                $options: "i",
            };
            chapter = await Chapter.find(searchFilters)
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalCount = await Chapter.countDocuments(searchFilters);
        } else {
            chapter = await Chapter.find()
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            totalCount = await Chapter.countDocuments();
        }

        return res.status(httpStatus.OK).json({
            success: true,
            message: "Chapter found!",
            chapters: chapter,
            count: chapter.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while fetching Chapters"
        );
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

export const updateChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sanitiseBody: any = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = await sanitiseReqBody(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { title, content, courseId } = sanitiseBody;

        const chapter = await Chapter.findById({
            _id: req.params.id,
        });

        if (!chapter) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "User not found"));
        }

        chapter.content = content ? content : chapter.content;

        chapter.title = title ? title : chapter.title;

        chapter.courseId = courseId ? courseId : chapter.courseId;

        await chapter.save();

        res.status(httpStatus.OK).json({
            success: true,
            message: "chapter updated successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while updating chapters"
        );
    }
};

export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res
                .status(404)
                .json({ success: false, message: "chapter not found" });
        }
        res.status(httpStatus.OK).json({
            success: true,
            message: "chapter deleted successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while deleting chapters"
        );
    }
};
