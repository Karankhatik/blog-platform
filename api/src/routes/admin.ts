import express from 'express';
const router = express.Router();
import * as AdminRoute from '../controllers/admin.controller';
import {adminParamValidation, validateMiddleware}  from '../middleware/joiValidation/admin';
import { protect } from '../middleware/auth.middleware';

// Temporary use
router.post("/register", validateMiddleware(adminParamValidation.register), AdminRoute.register);


export default router;
