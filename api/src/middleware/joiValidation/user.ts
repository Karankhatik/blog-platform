import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface ValidationSchemas {
  register: Joi.ObjectSchema;
  login: Joi.ObjectSchema;
  verify: Joi.ObjectSchema;
  forgetPassword: Joi.ObjectSchema;
  resetPassword: Joi.ObjectSchema;
  updatePassword: Joi.ObjectSchema;
  updateProfile: Joi.ObjectSchema;
}

const userParamValidation: ValidationSchemas = {
  register: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().required()
  }),
  verify: Joi.object({
    otp: Joi.string().min(3).required(),
    email: Joi.string().lowercase().email().required(),
  }),
  forgetPassword: Joi.object({
    email: Joi.string().lowercase().email().required(),
  }),
  resetPassword: Joi.object({
    otp: Joi.string().min(3).required(),
    newPassword: Joi.string().min(6).required(),
  }),
  updatePassword: Joi.object({    
    newPassword: Joi.string().min(6).required(),
  }),
  updateProfile: Joi.object({
    name: Joi.string(),
    profileImage: Joi.string()
  })
};

const validateMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
      const errorMessage = validation.error.details[0].message;
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
};

export { userParamValidation, validateMiddleware };
