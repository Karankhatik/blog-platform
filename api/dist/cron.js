"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const BACKEND_URL = 'https://your-backend-url.com/api-endpoint';
function hitBackendUrl() {
    axios_1.default.get(BACKEND_URL)
        .then(response => {
        console.log('Backend URL hit successfully:', response.data);
    })
        .catch(error => {
        console.error('Error hitting backend URL:', error.message);
    });
}
// Schedule the cron job to run every 10 minutes
node_cron_1.default.schedule('*/10 * * * *', hitBackendUrl);
console.log('Cron job scheduled to hit the backend URL every 10 minutes.');
