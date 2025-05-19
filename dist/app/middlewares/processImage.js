"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
const processImage = ({ fieldName }) => {
    return (req, res, next) => {
        try {
            const files = req.files;
            const body = {
                ...req.body,
                [fieldName]: files && files[fieldName] && files[fieldName].length > 0
                    ? files[fieldName][0].path
                    : null,
            };
            req.body = body;
            next();
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Something went wrong from the route.";
            res.status(400).json({ error: errorMessage });
        }
    };
};
exports.processImage = processImage;
