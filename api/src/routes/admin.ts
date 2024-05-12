import express from 'express';
const router = express.Router();
import * as AdminRoute from '../controllers/admin.controller';
import {adminParamValidation, validateMiddleware}  from '../middleware/joiValidation/admin';


// Temporary use
router.post("/register", validateMiddleware(adminParamValidation.register), AdminRoute.register);


export default router;
