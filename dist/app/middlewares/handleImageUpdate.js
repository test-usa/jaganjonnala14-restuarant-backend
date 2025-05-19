"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageUpdate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleImageUpdate = ({ model, imageField, folderPath, }) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const document = await model.findById(id);
            if (!document) {
                throw new Error("Document not found");
            }
            if (!document.isActive) {
                throw new Error("Document is not active");
            }
            if (document.isDelete) {
                throw new Error("Document is deleted");
            }
            const newImage = req.body[imageField];
            const oldImage = document[imageField];
            // If there's a new image
            if (newImage) {
                const newImageName = path_1.default.basename(newImage);
                const newImagePath = path_1.default.join(__dirname, `../../../${folderPath}`, newImageName);
                // Check if old image exists and is different
                if (oldImage && oldImage !== newImage) {
                    const oldImageName = path_1.default.basename(oldImage);
                    const oldImagePath = path_1.default.join(__dirname, `../../../${folderPath}`, oldImageName);
                    if (fs_1.default.existsSync(oldImagePath)) {
                        fs_1.default.unlinkSync(oldImagePath); // Delete old image
                    }
                }
                // If image exists but was uploaded by mistake (not saved to DB), delete it
                if (!oldImage && fs_1.default.existsSync(newImagePath)) {
                    // Allow the image to be saved now
                    req.body[imageField] = newImage.replace(/\\/g, "/");
                }
                // If new file doesn't exist for some reason, null it to avoid broken refs
                if (!fs_1.default.existsSync(newImagePath)) {
                    req.body[imageField] = null;
                }
            }
            else {
                // No new image provided — optionally clean up old image?
                req.body[imageField] = oldImage || null;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleImageUpdate = handleImageUpdate;
