"use strict";
// import sharp from "sharp";
// import fs from "fs";
// import { Request, Response, NextFunction } from "express";
// import path from "path";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoComposure = void 0;
// export const photoComposure = () => {
//   const single = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { file } = req;
//       if (!file) {
//         return next();
//       }
//       await processFile(file as Express.Multer.File, "webp", 100);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
//   const fields = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { files } = req;
//       if (!files) {
//         return next();
//       }
//       for (const fieldName in files) {
//         const fieldFiles = Array.isArray(files)
//           ? files
//           : (files[fieldName] as Express.Multer.File[]);
//         for (const file of fieldFiles) {
//           await processFile(file as Express.Multer.File, "webp", 100);
//         }
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
//   const array = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { files } = req;
//       if (!files) {
//         return next();
//       }
//       for (const fieldName in files) {
//         const fieldFiles = Array.isArray(files)
//           ? files
//           : (files[fieldName] as Express.Multer.File[]);
//         for (const file of fieldFiles) {
//           await processFile(file as Express.Multer.File, "webp", 100);
//         }
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
//   const configurableCompression = (
//     format: "webp" | "jpeg" | "png" = "webp",
//     quality: number = 80
//   ): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
//     return async (
//       req: Request,
//       res: Response,
//       next: NextFunction
//     ): Promise<void> => {
//       try {
//         const { file, files } = req;
//         if (file) {
//           await processFile(file as Express.Multer.File, format, quality);
//         }
//         if (files) {
//           for (const fieldName in files) {
//             const fieldFiles = Array.isArray(files)
//               ? files
//               : (files[fieldName] as Express.Multer.File[]);
//             for (const file of fieldFiles) {
//               await processFile(file as Express.Multer.File, format, quality);
//             }
//           }
//         }
//         next();
//       } catch (error) {
//         next(error);
//       }
//     };
//   };
//   const processFile = async (
//     file: Express.Multer.File,
//     format: "webp" | "jpeg" | "png",
//     quality: number
//   ): Promise<void> => {
//     try {
//       const { path: filePath, originalname } = file;
//       const fileExt = path.extname(originalname).toLowerCase();
//       const compressedPath = filePath.replace(fileExt, `-compressed.${format}`);
//       const readFile = fs.readFileSync(filePath);
//       const image = sharp(readFile);
//       // Process the image based on the desired format
//       if (format === "webp") {
//         await image.webp({ quality }).toFile(compressedPath);
//       } else if (format === "jpeg") {
//         await image.jpeg({ quality }).toFile(compressedPath);
//       } else if (format === "png") {
//         await image.png({ quality }).toFile(compressedPath);
//       } else {
//         throw new Error("Unsupported format");
//       }
//       // Delete the original file
//       await fs.promises.unlink(filePath);
//       file.path = compressedPath; // Update file path in request
//       file.filename = path.basename(compressedPath);
//     } catch (error) {
//       console.error(`Error processing file ${file.path}:`, error);
//       throw error;
//     }
//   };
//   return { single, fields, array, configurableCompression };
// };
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const photoComposure = () => {
    const single = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file)
                return next();
            yield processFile(req.file, "webp", 100);
            next();
        }
        catch (error) {
            next(error);
        }
    });
    const array = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.files || !Array.isArray(req.files))
                return next();
            yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield processFile(file, "webp", 100);
            })));
            next();
        }
        catch (error) {
            next(error);
        }
    });
    const configurableCompression = (format = "webp", quality = 80) => {
        return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (req.file) {
                    yield processFile(req.file, format, quality);
                }
                if (req.files && Array.isArray(req.files)) {
                    yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                        yield processFile(file, format, quality);
                    })));
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    };
    const processFile = (file, format, quality) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { path: filePath, originalname } = file;
            const fileExt = path_1.default.extname(originalname).toLowerCase();
            const compressedPath = filePath.replace(fileExt, `-compressed.${format}`);
            const readFile = fs_1.default.readFileSync(filePath);
            const image = (0, sharp_1.default)(readFile);
            // Process the image based on the desired format
            if (format === "webp") {
                yield image.webp({ quality }).toFile(compressedPath);
            }
            else if (format === "jpeg") {
                yield image.jpeg({ quality }).toFile(compressedPath);
            }
            else if (format === "png") {
                yield image.png({ quality }).toFile(compressedPath);
            }
            else {
                throw new Error("Unsupported format");
            }
            // Delete the original file
            yield fs_1.default.promises.unlink(filePath);
            file.path = compressedPath; // Update file path in request
            file.filename = path_1.default.basename(compressedPath);
        }
        catch (error) {
            console.error(`Error processing file ${file.path}:`, error);
            throw error;
        }
    });
    return { single, array, configurableCompression };
};
exports.photoComposure = photoComposure;
