"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
require('dotenv').config();
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, database_1.default)();
const port = process.env.PORT || 3000;
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
server_1.default.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
