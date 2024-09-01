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
exports.sendMailForMessage = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const sanetize_1 = __importDefault(require("../helpers/sanetize"));
const sendMailForMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sanitiseBody = {};
        for (let key in req.body) {
            let unsafeValue = req.body[key];
            let safeValue = yield (0, sanetize_1.default)(unsafeValue);
            sanitiseBody[key] = safeValue;
        }
        const { name, message } = sanitiseBody;
        let htmlContent = `<h2>${name},</h2><p>${message}</p>`;
        yield (0, sendMail_1.default)({ email: 'karankhatik.dev@gmail.com', subject: "Some one contacting you", bodyHtml: htmlContent });
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Message sent successfully"
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
});
exports.sendMailForMessage = sendMailForMessage;
