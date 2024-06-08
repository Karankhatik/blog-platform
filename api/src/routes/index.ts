import express from 'express';
const router = express.Router();
import adminRouter from './admin.route';
import usersRouter from './users.route';
import courseRouter from './course.route';
import chaptersRouter from './chapters.route';
import {refreshAccessToken, login, logout} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import chapterRoutes from './chapters.route';

router.use('/admin', adminRouter);
router.use('/users', usersRouter);
router.use('/course', courseRouter);
router.use('/chapters', chaptersRouter);
router.use('/auth/refreshToken', refreshAccessToken);
router.use('/auth/login', login);
router.use('/auth/logout',protect, logout);
router.use('/chapters', chapterRoutes);


export default router;
