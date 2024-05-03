import express, { Express, Request, Response } from "express";
import app from "./server";
require('dotenv').config();
import connectionDatabase from "./config/database";
import dotenv from "dotenv";




connectionDatabase();



const port = process.env.PORT || 3000;



app.listen(port, () => {  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});