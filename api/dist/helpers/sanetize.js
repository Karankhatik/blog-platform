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
const jsdom_1 = require("jsdom");
const { window } = new jsdom_1.JSDOM('');
const dompurify_1 = __importDefault(require("dompurify"));
const createDOMPurify = (0, dompurify_1.default)(window);
const sanitiseReqBody = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = {
            ALLOWED_TAGS: [], // don't allow any tags
            ALLOWED_ATTR: [], // don't allow any attributes
            ALLOW_DATA_ATTR: false, // disallow data-* attributes
            FORBID_SCRIPTS: true, // forbid <script> tags and event attributes
            FORBID_TAGS: ['style'], // forbid <style> tags
        };
        const sanitiseInput = (input) => __awaiter(void 0, void 0, void 0, function* () {
            if (input === null || input === undefined) {
                return null;
            }
            else if (Array.isArray(input)) {
                const sanitizedInput = [];
                for (let i = 0; i < input.length; i++) {
                    const sanitizedValue = yield sanitiseInput(input[i]);
                    sanitizedInput.push(sanitizedValue);
                }
                return sanitizedInput;
            }
            else if (typeof input === 'object') {
                const sanitizedInput = {};
                for (const key in input) {
                    if (Object.prototype.hasOwnProperty.call(input, key)) {
                        const sanitizedValue = yield sanitiseInput(input[key]);
                        sanitizedInput[key] = sanitizedValue;
                    }
                }
                return sanitizedInput;
            }
            else if (typeof input === 'string') {
                const sanitizedValue = createDOMPurify.sanitize(input, config);
                const maliciousPayloadRegex = /javascript:/gi;
                const sanitizedValueWithoutMaliciousPayload = sanitizedValue.replace(maliciousPayloadRegex, '');
                if (input.length === 0)
                    return '';
                else
                    return sanitizedValueWithoutMaliciousPayload.trim() || null;
            }
            else {
                return input;
            }
        });
        const cleanData = yield sanitiseInput(data);
        if (cleanData === null || cleanData === undefined) {
            return null;
        }
        else if (Array.isArray(cleanData)) {
            return cleanData.length > 0 ? cleanData : [];
        }
        else if (typeof cleanData === 'object') {
            return Object.keys(cleanData).length > 0 ? cleanData : {};
        }
        else {
            return cleanData;
        }
    }
    catch (error) {
        console.error("Internal server error: ", error);
        throw new Error("Internal server error");
    }
});
exports.default = sanitiseReqBody;
