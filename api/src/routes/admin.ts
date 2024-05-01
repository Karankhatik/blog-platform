import express from 'express';
const router = express.Router();
import * as AdminRoute from '../controllers/admin';
import {adminParamValidation, validateMiddleware}  from '../middleware/joiValidation/admin';

// Temporary use
router.post("/register", validateMiddleware(adminParamValidation.register), AdminRoute.register);

// Routes
router.post("/login", validateMiddleware(adminParamValidation.login),  AdminRoute.login);
router.get("/logout", AdminRoute.logout);

export default router;
