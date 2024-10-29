"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
require('dotenv').config();
const database_1 = __importDefault(require("./config/database"));
(0, database_1.default)();
// setInterval(() => {
//   console.log("PING API")
// }, 5000)
const port = process.env.PORT || 8000;
server_1.default.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
