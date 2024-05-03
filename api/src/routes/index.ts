import express from 'express';
const router = express.Router();
import adminRouter from './admin';
import usersRouter from './users';

router.use('/admin', adminRouter);
router.use('/users', usersRouter);

export default router;
