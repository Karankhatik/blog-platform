import { Request, Response, NextFunction } from "express";
import Course from "../models/course.model";
import sanitiseReqBody from "../helpers/sanetize";
import * as httpStatus from "http-status";
import ApiError from "../utils/APIError";

export const createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let sanitisedBody: { [key: string]: any } = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            // Assuming sanitiseReqBody is a function that sanitises input
            let safeValue = await sanitiseReqBody(unsafeValue);
            sanitisedBody[key] = safeValue;
        }
        console.log(sanitisedBody);
        const course = new Course({
            title: sanitisedBody.title,
            description: sanitisedBody.description,
            // userId: sanitisedBody.userId,
        });

        await course.save();

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Course created successfully",
        });
    } catch (error: any) {
        console.log(error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while creating course"
        );
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        // Ensure page and limit are positive integers
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;

        console.log("page: ", page, "limit: ", limit);
        const skip = (page - 1) * limit;

        const searchFilters: any = {};
        let course: any = [];
        let totalCount: number;

        if(!req.query.page && !req.query.limit) {
            const course = await Course.find();
            return res.status(httpStatus.OK).json({
                success: true,
                message: "course found!",
                courses: course                
            })
        }

        // Search query parameter
        if (req.query.title) {
            searchFilters.title = {
                $regex: req.query.title as string,
                $options: "i",
            };
            course = await Course.find(searchFilters)
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalCount = await Course.countDocuments(searchFilters);
        } else {
            course = await Course.find()
                .select("")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            totalCount = await Course.countDocuments();
        }

        return res.status(httpStatus.OK).json({
            success: true,
            message: "course found!",
            courses: course,
            count: course.length,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while fetching courses"
        );
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, data: course });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while fetching courses"
        );
    }
};

export const updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let sanitiseBody: any = {};
        for (const key in req.body) {
            const unsafeValue = req.body[key];
            const safeValue = await sanitiseReqBody(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { description, title } = sanitiseBody;

        const course = await Course.findById({
            _id: req.params.id,
        });

        if (!course) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "User not found"));
        }

        course.description = description ? description : course.description;

        course.title = title ? title : course.title;

        await course.save();

        res.status(httpStatus.OK).json({
            success: true,
            message: "Course updated successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while updating courses"
        );
    }
};

export const deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }
        res.status(httpStatus.OK).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error: any) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while deleting courses"
        );
    }
};
