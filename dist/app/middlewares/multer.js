"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMuler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getMuler = ({ upload_file_destination_path, regex, images, }) => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            if (!fs_1.default.existsSync(upload_file_destination_path)) {
                fs_1.default.mkdirSync(upload_file_destination_path, { recursive: true });
            }
            cb(null, upload_file_destination_path);
        },
        filename: function (req, file, cb) {
            const extention = path_1.default.extname(file === null || file === void 0 ? void 0 : file.originalname);
            const file_name = (file === null || file === void 0 ? void 0 : file.originalname.replace(extention, "").toLowerCase().split(" ").join("-")) +
                "-" +
                Date.now();
            cb(null, file_name + extention);
        },
    });
    // File filter function
    const fileFilter = (regex, images, file, cb) => {
        const extName = regex.test(path_1.default.extname(file === null || file === void 0 ? void 0 : file.originalname).toLowerCase());
        const mimeType = regex.test(file === null || file === void 0 ? void 0 : file.mimetype);
        if (mimeType && extName) {
            return cb(null, true); // Accept the file
        }
        else {
            return cb(new Error(`You can only upload images of type: ${images}.`), false); // Reject the file
        }
    };
    return (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 10000000 * 3,
        },
        fileFilter: (req, file, cb) => fileFilter(regex, images, file, cb),
    });
};
exports.getMuler = getMuler;
