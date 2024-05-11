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
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', 
  exposedHeaders: ['Authorization'],
  credentials: true, 
}));

app.use("/api/v1", routes);

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
