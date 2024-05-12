import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import logger from 'morgan';
import helmet from 'helmet';
import httpStatus from 'http-status';
import APIError from './utils/APIError'; 
import routes from './routes';  

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Content-Type", "application/json");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
}));

app.use(logger('dev'));

app.use((req: Request,res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader(`Permissions-Policy`, `accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()`);
  next();
});

// Extract the single allowed origin from the environment variable
const allowedOrigin: string | undefined = process.env.CLIENT_SERVER_URL;

// Define CORS options with TypeScript typing
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests if there's no origin (e.g., Mobile apps, Postman) or if the origin matches the allowed one
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200 // Defaults to 204, but may be set to 200 if needed
};


app.use(cors(corsOptions));

// set helmet to protect server from malicious attacks...
app.use(helmet({
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

app.use(helmet());

app.use("/api/v1", routes);

app.use((req, res, next: NextFunction) => {
  return next(new APIError(httpStatus.NOT_FOUND, "API Not Found"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Set the status code and send the JSON response
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
      .header('Content-Type', 'application/json') 
      .json({ success: false, message: err.message});
});


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;
