import { Request, Response, NextFunction } from 'express';
import Course from '../models/course.model';
import sanitiseReqBody from '../helpers/sanetize';
import * as httpStatus from "http-status";
import  ApiError  from "../utils/APIError";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
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
            userId: sanitisedBody.userId 
          });
      
        await course.save();

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    } catch (error:any) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while creating course");
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find();
        res.json({ success: true, data: courses });
    } catch (error:any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching courses");
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, data: course });
    } catch (error:any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while fetching courses");
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, data: course });
    } catch (error:any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while updating courses");
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, message: "Course deleted successfully" });
    } catch (error:any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while deleting courses");    }
};


