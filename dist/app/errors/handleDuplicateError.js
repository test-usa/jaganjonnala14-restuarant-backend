"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];
    const errorSource = [
        {
            path: "",
            message: `${extractedMessage} is already exists`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Invalid ID",
        errorSource,
    };
};
exports.default = handleDuplicateError;
