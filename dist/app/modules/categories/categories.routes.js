"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
// categories.routes.ts - categories module
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const categories_validation_1 = require("./categories.validation");
const categories_controller_1 = require("./categories.controller");
const router = express_1.default.Router();
router.post("/post_category", (0, validateRequest_1.validateRequest)(categories_validation_1.categoryValidationSchema), categories_controller_1.categoryController.postCategory);
router.put("/put_category/:id", (0, validateRequest_1.validateRequest)(categories_validation_1.editCategoryValidationSchema), categories_controller_1.categoryController.putCategory);
router.get("/get_category", categories_controller_1.categoryController.getCategory);
router.get("/get_category_for_sidebar", categories_controller_1.categoryController.getCategoryForSidebar);
router.delete("/delete_category/:id", categories_controller_1.categoryController.deleteCategory);
router.delete("/category_bulk_delete", categories_controller_1.categoryController.bulkDeleteCategory);
exports.categoryRoutes = router;
