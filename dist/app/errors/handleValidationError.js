"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorSource = Object.values(err.errors).map((val) => {
        return {
            path: val?.path,
            message: val?.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error",
        errorSource,
    };
};
exports.default = handleValidationError;
