import app from "./server";
require('dotenv').config();
import connectionDatabase from "./config/database";


connectionDatabase();

const port = process.env.PORT || 8000;

app.listen(port, () => {  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});