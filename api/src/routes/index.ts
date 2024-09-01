import express from 'express';
const router = express.Router();
import adminRouter from './admin.route';
import usersRouter from './users.route';
import {refreshAccessToken, login, logout} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import articleRoutes from './article.route';
import { sendMailForMessage } from '../controllers/common.controller';


router.use('/admin', adminRouter);
router.use('/users', usersRouter);
router.use('/article', articleRoutes);
router.use('/auth/refreshToken', refreshAccessToken);
router.use('/auth/login', login);
router.use('/auth/logout',protect, logout);
router.post('/sendEmail', sendMailForMessage);



export default router;
