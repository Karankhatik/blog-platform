"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Schema definition
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    isEditor: {
        type: Boolean,
        default: false,
    },
    isRequested: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    refreshToken: String,
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
}, { timestamps: true });
userSchema.methods.generateAccessToken = function () {
    const secret = process.env.ACCESS_TOKEN_SECRET || '2sdnkn4rcsdcno4fh'; //default secret key
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, secret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h'
    });
};
userSchema.methods.generateRefreshToken = function () {
    const secret = process.env.REFRESH_TOKEN_SECRET || 'kjvldkfvlndfdfbvdvnsdv'; //default secret key
    return jsonwebtoken_1.default.sign({
        _id: this._id
    }, secret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    });
};
// Create the model according to the schema.
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
