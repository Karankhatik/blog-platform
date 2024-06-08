import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import ApiError from '../../utils/APIError';

interface CourseValidationSchemas {
  createCourse: Joi.ObjectSchema;
  updateCourse: Joi.ObjectSchema;
}

const courseParamValidation: CourseValidationSchemas = {
  createCourse: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    userId: Joi.string().required(), // Assuming userId is a string; adjust as necessary for your ObjectId validation if needed
  }),
  updateCourse: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    chapters: Joi.array()
  })
};

const validateCourseMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next();
  };
};

export { courseParamValidation, validateCourseMiddleware };
