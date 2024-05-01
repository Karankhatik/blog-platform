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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const comman_1 = require("../utils/comman");
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const StatusCodes = __importStar(require("http-status"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitisedBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitisedBody[key] = safeValue;
        }
        let admin = yield admin_1.default.findOne({ email: sanitisedBody.email });
        if (admin) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Admin already exists" });
        }
        let encryptedPassword = yield (0, comman_1.encryptPassword)(sanitisedBody.password);
        sanitisedBody.password = encryptedPassword;
        admin = yield admin_1.default.create(sanitisedBody);
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Admin signup successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sanitize each input
        const email = yield (0, sanetize_1.default)(req.body.email);
        const password = yield (0, sanetize_1.default)(req.body.password);
        const admin = yield admin_1.default.findOne({ email });
        if (!admin) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: 'Admin not found' });
        }
        const isPasswordValid = yield (0, comman_1.decryptPassword)(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: 'Invalid credentials' });
        }
        const token = (0, comman_1.generateJWTAccessToken)(admin);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Logged in successfully',
            token,
            admin: { id: admin.id, email: admin.email }
        });
    }
    catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(StatusCodes.OK)
            .cookie("token", null, {
            expires: new Date(Date.now())
        })
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});
exports.logout = logout;
