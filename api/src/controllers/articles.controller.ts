import { Request, Response, NextFunction } from 'express';
import Article from '../models/article.model';
import sanitiseReqBody from '../helpers/sanetize';
import * as httpStatus from "http-status";
import  ApiError  from "../utils/APIError";

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Article created successfully',
            data: article
        });
    } catch (error:any) {
        next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
};

export const getAllArticles = async (req: Request, res: Response) => {
    try {
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;

        const skip = (page - 1) * limit;

        const searchFilters: any = {};
        let article: any = [];
        let totalCount: number;

        // Search query parameter
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title as string,
                $options: "i",
            };
            article = await Article.find(searchFilters)
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalCount = await Article.countDocuments(searchFilters);
        } else {
            article = await Article.find()
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            totalCount = await Article.countDocuments();
        }

        return res.status(httpStatus.OK).json({
            success: true,
            message: "Article found!",
            articles: article,
            count: article.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while fetching Articles"
        );
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Article not found' });
        }
        res.json({ success: true, data: article });
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sanitiseBody: any = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = await sanitiseReqBody(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const {content, } = req.body;
        const { title, draftStage, slug, description, feedbacks } = sanitiseBody;

        const article = await Article.findById({
            _id: req.params.id,
        });

        if (!article) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "User not found"));
        }

        article.content = content ? content : article.content;

        article.title = title ? title : article.title;

        article.draftStage = draftStage ? draftStage : article.draftStage;

        article.slug = slug ? slug : article.slug;

        article.description = description ? description : article.description;

        article.feedbacks = feedbacks ? feedbacks : article.feedbacks;

        await article.save();

        res.status(httpStatus.OK).json({
            success: true,
            message: "article updated successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while updating Articles"
        );
    }
};

export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res
                .status(404)
                .json({ success: false, message: "article not found" });
        }
        res.status(httpStatus.OK).json({
            success: true,
            message: "article deleted successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while deleting Articles"
        );
    }
};
