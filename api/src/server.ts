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

// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.header("Content-Type", "application/json");
//     next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
}));

app.use(logger('dev'));
app.use(helmet());
app.use(cors());

app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;
