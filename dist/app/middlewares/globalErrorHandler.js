"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong.";
    let errorSource = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    // handle zod error
    if (err instanceof zod_1.ZodError) {
        const simplifiedErrors = (0, handleZodError_1.default)(err);
        statusCode = simplifiedErrors?.statusCode;
        message = simplifiedErrors?.message;
        errorSource = simplifiedErrors?.errorSource || [];
    }
    else if (err?.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSource = simplifiedError?.errorSource || [];
    }
    else if (err?.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSource = simplifiedError?.errorSource || [];
    }
    else if (err?.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSource = simplifiedError?.errorSource || [];
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSource = [
            {
                path: "",
                message: err?.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSource = [
            {
                path: "",
                message: err?.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        stack: config_1.default.ENVIRONMENT === "development" ? err?.stack : undefined,
    });
};
exports.default = globalErrorHandler;
