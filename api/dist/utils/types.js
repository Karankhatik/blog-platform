"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
exports.options = {
    httpOnly: false, // Cookie cannot be accessed by client-side APIs like JavaScript
    secure: true, // Cookie is only sent over HTTPS
    sameSite: 'none', // Cookie is allowed to be sent with cross-site requests
    path: '/' // Cookie is available across the entire site
};
