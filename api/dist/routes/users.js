"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoute = __importStar(require("../controllers/users.controller"));
const user_1 = require("../middleware/joiValidation/user");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, user_1.validateMiddleware)(user_1.userParamValidation.register), userRoute.register); //test done
router.post("/verify", (0, user_1.validateMiddleware)(user_1.userParamValidation.verify), userRoute.verify); //test done
router.get("/me", auth_middleware_1.protect, userRoute.getMyProfile);
router.put("/updateprofile", auth_middleware_1.protect, (0, user_1.validateMiddleware)(user_1.userParamValidation.updateProfile), userRoute.updateProfile);
router.put("/updatepassword", auth_middleware_1.protect, userRoute.updatePassword);
router.post("/forgetpassword", (0, user_1.validateMiddleware)(user_1.userParamValidation.forgetPassword), userRoute.forgetPassword);
router.patch("/resetpassword", userRoute.resetPassword);
router.post("/reSendOtp", userRoute.reSendOtp); //test done
router.post("/applyForEditor", auth_middleware_1.protect, userRoute.applyForEditor);
exports.default = router;
