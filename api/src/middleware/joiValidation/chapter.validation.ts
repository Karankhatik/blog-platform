import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/APIError';

interface ChapterValidationSchemas {
  createChapter: Joi.ObjectSchema;
  updateChapter: Joi.ObjectSchema;
}

const chapterParamValidation: ChapterValidationSchemas = {
  createChapter: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId format
    course: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  updateChapter: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
    course: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
  })
};

const validateChapterMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next();
  };
};

export { chapterParamValidation, validateChapterMiddleware };
