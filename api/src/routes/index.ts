import express from 'express';
const router = express.Router();
import adminRouter from './admin';
import usersRouter from './users';
import {refreshAccessToken, login, logout} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

router.use('/admin', adminRouter);
router.use('/users', usersRouter);
router.use('/auth/refreshToken', refreshAccessToken);
router.use('/auth/login', login);
router.use('/auth/logout',protect, logout);



export default router;
