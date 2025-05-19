"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipleFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleMultipleFile = ({ model, fileField, folderPath, }) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const document = await model.findById(id);
            if (!document)
                throw new Error("Document not found");
            if (!document.isActive)
                throw new Error("Document is not active");
            if (document.isDelete)
                throw new Error("Document is deleted");
            const newFiles = req.body[fileField] || [];
            const oldFiles = document[fileField] || [];
            const normalizedNewFiles = Array.isArray(newFiles)
                ? newFiles.map((img) => img.replace(/\\/g, "/"))
                : [];
            // Delete Files from old list that are no longer in new list
            for (const oldFile of oldFiles) {
                if (!normalizedNewFiles.includes(oldFile)) {
                    const oldFileName = path_1.default.basename(oldFile);
                    const oldFilePath = path_1.default.join(__dirname, `../../../${folderPath}`, oldFileName);
                    if (fs_1.default.existsSync(oldFilePath)) {
                        fs_1.default.unlinkSync(oldFilePath);
                    }
                }
            }
            // Validate new Files exist, else remove invalid ones
            const validatedFiles = normalizedNewFiles.filter((filePath) => {
                const FileName = path_1.default.basename(filePath);
                const fullPath = path_1.default.join(__dirname, `../../../${folderPath}`, FileName);
                return fs_1.default.existsSync(fullPath);
            });
            req.body[fileField] = validatedFiles;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleMultipleFile = handleMultipleFile;
