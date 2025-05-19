"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpToPhone = void 0;
// utils/sendOtpToPhone.ts
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendOtpToPhone = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `
        🔐 OTP Verification
        
        Your OTP is: ${otp}
        
        ⏳ This code is valid for 5 minutes.
        ❗ Do not share it with anyone.
      
        `.trim(),
            from: process.env.TWILIO_PHONE,
            to: phone.startsWith("+") ? phone : `+${phone}`, // Ensure E.164 format
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`${error.message}`);
        }
        else {
            throw new Error("Could not send OTP to phone.");
        }
    }
};
exports.sendOtpToPhone = sendOtpToPhone;
