import { Router } from 'express';
import * as userRoute from '../controllers/users.controller';
import { userParamValidation, validateMiddleware } from '../middleware/joiValidation/user.validation';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.post("/register", validateMiddleware(userParamValidation.register), userRoute.register); //test done

router.post("/verify", validateMiddleware(userParamValidation.verify), userRoute.verify); //test done


router.get("/me", protect, userRoute.getMyProfile);
router.put("/updateprofile", protect, validateMiddleware(userParamValidation.updateProfile), userRoute.updateProfile);
router.put("/updatepassword", protect, userRoute.updatePassword);

router.post("/forgetpassword", validateMiddleware(userParamValidation.forgetPassword), userRoute.forgetPassword);
router.patch("/resetPassword", validateMiddleware(userParamValidation.resetPassword),  userRoute.resetPassword);
router.post("/reSendOtp",  userRoute.reSendOtp); //test done

router.post("/applyForEditor", protect, userRoute.applyForEditor);

router.get("/all", protect, authorize,  userRoute.getAllUsers);
router.put("/updateUser/:id", protect, authorize,  userRoute.updateUserByAdmin);
router.delete("/deleteUser/:id", protect, authorize,  userRoute.deleteUserByAdmin);

export default router;
