import { Router } from 'express';
import * as courseController from '../controllers/course.controller';//import { userParamValidation, validateMiddleware } from '../middleware/joiValidation/user';
import { protect } from '../middleware/auth.middleware';
import { courseParamValidation, validateCourseMiddleware } from '../middleware/joiValidation/course.validation';
import { authorize } from '../middleware/auth.middleware';
const router = Router();

router.post('/', protect, authorize, validateCourseMiddleware(courseParamValidation.createCourse), courseController.createCourse); // Create a new course
router.get('/',  courseController.getAllCourses); // Get all courses
router.get('/:id', protect, authorize, courseController.getCourseById); // Get a specific course by id
router.put('/:id', protect, authorize, validateCourseMiddleware(courseParamValidation.updateCourse), courseController.updateCourse); // Update a specific course
router.delete('/:id', protect, authorize, courseController.deleteCourse); // Delete a specific course


export default router;
