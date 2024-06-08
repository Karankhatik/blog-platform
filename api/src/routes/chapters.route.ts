import { Router } from 'express';
import * as chapterController from '../controllers/chapters.controller';
import { chapterParamValidation, validateChapterMiddleware } from '../middleware/joiValidation/chapter.validation';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';
const router = Router();

router.post('/', protect, authorize, validateChapterMiddleware(chapterParamValidation.createChapter), chapterController.createChapter);
router.get('/', protect, chapterController.getAllChapters);
router.get('/:id', protect, chapterController.getChapterById);
router.put('/:id', protect, authorize, validateChapterMiddleware(chapterParamValidation.updateChapter), chapterController.updateChapter);
router.delete('/:id', protect, authorize, chapterController.deleteChapter);

export default router;
