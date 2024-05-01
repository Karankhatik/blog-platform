import express from 'express';
const router = express.Router();
import adminRouter from './admin';

router.use('/admin', adminRouter);

export default router;
