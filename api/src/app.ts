import express, { Express, Request, Response } from "express";
import app from "./server";
require('dotenv').config();
import connectionDatabase from "./config/database";
import dotenv from "dotenv";

dotenv.config();


connectionDatabase();



const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

app.listen(port, () => {  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});