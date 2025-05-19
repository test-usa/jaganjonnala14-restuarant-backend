"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMedia = void 0;
const processMedia = ({ fields }) => {
    return (req, res, next) => {
        try {
            const files = req.files;
            const updatedBody = {
                ...req.body,
            };
            for (const field of fields) {
                const { fieldName, isMultiple } = field;
                if (files && files[fieldName]) {
                    updatedBody[fieldName] = isMultiple
                        ? files[fieldName].map((file) => file.path.replace(/\\/g, "/"))
                        : files[fieldName][0].path.replace(/\\/g, "/");
                }
                else {
                    updatedBody[fieldName] = isMultiple ? [] : null;
                }
            }
            req.body = updatedBody;
            next();
        }
        catch (error) {
            res.status(400).json({
                error: error instanceof Error
                    ? error.message
                    : "Something went wrong while processing product media.",
            });
        }
    };
};
exports.processMedia = processMedia;
