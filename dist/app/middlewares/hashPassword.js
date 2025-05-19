"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, Number(process.env.HASHING_SALT));
        //    replace original password with hashed password
        req.body.password = hashedPassword;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = hashPassword;
