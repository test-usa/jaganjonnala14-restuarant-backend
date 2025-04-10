/* eslint-disable @typescript-eslint/no-explicit-any */
// categories.routes.ts - categories module
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  categoryValidationSchema,
  editCategoryValidationSchema,
} from "./categories.validation";
import { categoryController } from "./categories.controller";
import { photoComposure } from "../../middlewares/photoComposure";
import { uploadService } from "../upload/upload";
import { processCategoryImage } from "../../middlewares/fileProcessor/processCategoryImage";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/post_category",
  uploadService.fields([
    { name: "image", maxCount: 1 }, 
  ]),
  configurableCompression("jpeg", 60),
  processCategoryImage,
  validateRequest(categoryValidationSchema),
  categoryController.postCategory
);

router.put(
  "/put_category/:id",
  validateRequest(editCategoryValidationSchema),
  categoryController.putCategory
);
router.get("/get_category", categoryController.getCategory);
router.get(
  "/get_category_for_sidebar",
  categoryController.getCategoryForSidebar
);
router.delete("/delete_category/:id", categoryController.deleteCategory);
router.delete("/category_bulk_delete", categoryController.bulkDeleteCategory);

export const categoryRoutes = router;
