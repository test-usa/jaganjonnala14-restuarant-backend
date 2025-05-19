"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post("/create-category", sendImageToCloudinary_1.upload.single('image'), (req, res, next) => {
    next();
}, category_controller_1.categoryController.postCategory);
router.get("/all-category", category_controller_1.categoryController.getAllCategory);
router.get("/single-category/:id", category_controller_1.categoryController.getSingleCategory);
router.put("/update-category/:id", category_controller_1.categoryController.updateCategory);
router.delete("/delete-category/:id", category_controller_1.categoryController.deleteCategory);
exports.categoryRoutes = router;
