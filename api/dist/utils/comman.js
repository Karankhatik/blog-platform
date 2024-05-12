"use strict";
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
exports.decryptPassword = exports.encryptPassword = exports.generateOTP = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateOTP = () => {
    const digits = '123456789';
    let otp = '';
    for (let i = 1; i <= 6; i++) {
        let index = Math.floor(Math.random() * digits.length);
        otp += digits[index];
    }
    return otp;
};
exports.generateOTP = generateOTP;
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(12);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    return hashedPassword;
});
exports.encryptPassword = encryptPassword;
const decryptPassword = (enteredPassword, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bcryptjs_1.default.compare(enteredPassword, userPassword);
    return result;
});
exports.decryptPassword = decryptPassword;
