"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
/**
 * Extendable Error class used as a base for specific error types.
 * @extends Error
 */
class ExtendableError extends Error {
    constructor(message, status, isPublic) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param message - Error message.
     * @param status - HTTP status code of error, defaults to 500 Internal Server Error.
     * @param isPublic - Whether the message should be visible to user or not, defaults to true.
     */
    constructor(message, status = http_status_1.default.INTERNAL_SERVER_ERROR, isPublic = true) {
        super(message, status, isPublic);
    }
}
exports.default = APIError;
