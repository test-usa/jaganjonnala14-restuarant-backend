"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcryptjs_1.default.compare(password, hashedPassword);
    return isMatch;
};
exports.default = comparePassword;
