import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/APIError';

interface ArticleValidationSchemas {
  createArticle: Joi.ObjectSchema;
  updateArticle: Joi.ObjectSchema;
}

const articleParamValidation: ArticleValidationSchemas = {
  createArticle: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow(''),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId format
    slug: Joi.string().optional(),
    description: Joi.string().allow(''),    
  }),
  updateArticle: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().allow(''),   
    slug: Joi.string(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    description: Joi.string().allow(''),
    feedbacks: Joi.array().items(Joi.string())   
  })
};

const validateArticleMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next();
  };
};

export { articleParamValidation, validateArticleMiddleware };
