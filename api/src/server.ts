import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import httpStatus from "http-status";
import APIError from "./utils/APIError";
import routes from "./routes";
import { rateLimit } from "express-rate-limit";
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Content-Type", "application/json");
  next();
});

require("./cron");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  logger(
    `\x1b[37m\x1b[7m :date \x1b[0m \x1b[33m\x1b[1m:status\x1b[0m \x1b[2m:url\x1b[0m \x1b[1m\x1b[33m:method\x1b[0m :res[content-length] - :response-time ms`
  )
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader(
    `Permissions-Policy`,
    `accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()`
  );
  next();
});

// Define allowed origins
const allowedOrigins: string[] = [
  "http://localhost:3000",
  "https://tech-blog-taupe-seven.vercel.app",
  "https://intake-learn.onrender.com",
];

// Define CORS options with TypeScript typing
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// set helmet to protect server from malicious attacks...
app.use(helmet());

app.use(helmet());

// Create rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);
app.use("/api/v1", routes);

app.get("/ping/server", (req: Request, res: Response) => {
  res.send("ping server");
});

app.use((req, res, next: NextFunction) => {
  return next(new APIError(httpStatus.NOT_FOUND, "API Not Found"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Set the status code and send the JSON response
  res
    .status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
    .header("Content-Type", "application/json")
    .json({ success: false, message: err.message });
});

export default app;
