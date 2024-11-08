import cron from "node-cron";
import axios from "axios";

const BACKEND_URL = "https://intake-learn.onrender.com/ping/server";

function hitBackendUrl() {
  axios
    .get(BACKEND_URL)
    .then((response) => {
      console.log("Backend URL hit successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error hitting backend URL:", error.message);
    });
}

// Schedule the cron job to run every 10 minutes
cron.schedule("* * * * *", hitBackendUrl);

console.log("Cron job scheduled to hit the backend URL every 10 minutes.");
