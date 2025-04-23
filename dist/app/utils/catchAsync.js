"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            console.log("Error in catchAsync:", error);
            next(error);
        });
    };
};
exports.default = catchAsync;
