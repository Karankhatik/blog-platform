"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Content-Type", "application/json");
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((err, req, res, next) => {
    // Set the status code and send the JSON response
    res.status(err.status || http_status_1.default.INTERNAL_SERVER_ERROR)
        .header('Content-Type', 'application/json') // Set Content-Type header to application/json
        .json({
        error: {
            message: err.message,
            status: err.status,
            isPublic: err.isPublic
        }
    });
});
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Server is working");
});
exports.default = app;
