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
const APIError_1 = __importDefault(require("./utils/APIError"));
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
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader(`Permissions-Policy`, `accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()`);
    next();
});
// Define allowed origins
const allowedOrigins = process.env.CLIENT_SERVER_URL;
// Define CORS options with TypeScript typing
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || (allowedOrigins === null || allowedOrigins === void 0 ? void 0 : allowedOrigins.includes(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// set helmet to protect server from malicious attacks...
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "block-all-mixed-content": []
        },
    },
    frameguard: {
        action: "deny"
    }
}));
app.use((0, helmet_1.default)());
app.use("/api/v1", routes_1.default);
app.use((req, res, next) => {
    return next(new APIError_1.default(http_status_1.default.NOT_FOUND, "API Not Found"));
});
app.use((err, req, res, next) => {
    // Set the status code and send the JSON response
    res.status(err.status || http_status_1.default.INTERNAL_SERVER_ERROR)
        .header('Content-Type', 'application/json')
        .json({ success: false, message: err.message });
});
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
exports.default = app;
