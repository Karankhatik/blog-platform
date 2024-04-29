const express = require("express");
const app = express();
require('dotenv').config();
const connectDatabase = require("./config/database.js")


connectDatabase();
app.get("/", (req, res) => {
    res.send("Server is working");
  });
  
app.listen(process.env.PORT || 3000, (error) => {
    if(error){
        console.log(error);
    }
    console.log("Server is running on port", process.env.PORT || 3000);
})