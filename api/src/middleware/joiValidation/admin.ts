import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterSchema {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean | number;
}

interface LoginSchema {
  email: string;
  password: string;
}

const adminParamValidation = {
  register: Joi.object<RegisterSchema>({
    name: Joi.string().min(3).required(),
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().valid(0, 1, true, false).required(),
  }),
  login: Joi.object<LoginSchema>({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().required(),
  }),
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

export { 
  adminParamValidation,
  validateMiddleware
};
