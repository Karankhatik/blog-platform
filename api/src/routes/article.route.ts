import { Router } from 'express';
import * as articleController from '../controllers/articles.controller';
import { articleParamValidation, validateArticleMiddleware } from '../middleware/joiValidation/article.validation';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';
const router = Router();

router.post('/', protect, authorize, validateArticleMiddleware(articleParamValidation.createArticle), articleController.createArticle);
router.get('/', protect, articleController.getAllArticles);
router.get('/:id', protect, articleController.getArticleById);
router.put('/:id', protect, authorize, validateArticleMiddleware(articleParamValidation.updateArticle), articleController.updateArticle);
router.delete('/:id', protect, authorize, articleController.deleteArticle);

export default router;
