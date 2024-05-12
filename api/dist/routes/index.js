"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_1 = __importDefault(require("./admin"));
const users_1 = __importDefault(require("./users"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
router.use('/admin', admin_1.default);
router.use('/users', users_1.default);
router.use('/auth/refreshToken', auth_controller_1.refreshAccessToken);
router.use('/auth/login', auth_controller_1.login);
router.use('/auth/logout', auth_middleware_1.protect, auth_controller_1.logout);
exports.default = router;
