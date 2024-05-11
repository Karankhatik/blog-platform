"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpSendToEmailForSignUp = void 0;
// Function to generate the HTML content for the OTP email
const otpSendToEmailForSignUp = (otp) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    color: #4CAF50;
                }
                .content {
                    text-align: left;
                    margin-bottom: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .otp-box {
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .otp {
                    font-size: 32px;
                    font-weight: bold;
                    color: #4CAF50;
                    letter-spacing: 4px;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verification</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for signing up! To complete your registration, please use the following OTP to verify your account:</p>
                </div>
                <div class="otp-box">
                    <div class="otp">${otp}</div>
                </div>
                <div class="content">
                    <p>The OTP is valid for 5 minutes. Please do not share it with anyone.</p>
                    <p>Best regards,<br>Intake Learn </p>
                </div>
                <div class="footer">
                    <p>If you did not request this email, please ignore it.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
exports.otpSendToEmailForSignUp = otpSendToEmailForSignUp;
