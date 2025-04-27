import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoriesController } from "./categories.controller";
import {
  categoriesPostValidation,
  categoriesUpdateValidation,
} from "./categories.validation";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { ROLE } from "../../constant/role";
import { getMuler } from "../../middlewares/multer";
import { photoComposure } from "../../middlewares/photoComposure";
import { processImage } from "../../middlewares/processImage";
import { handleImageUpdate } from "../../middlewares/handleImageUpdate";
import { categoriesModel } from "./categories.model";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/post_category",
  authenticate,
  authorize(ROLE.ADMIN),
  getMuler({
    upload_file_destination_path: "uploads",
    regex: /\.(jpg|jpeg|png|webp)$/,
    images: "jpg, jpeg, png, webp",
  }).fields([{ name: "image", maxCount: 1 }]),

  configurableCompression("jpeg", 60),
  processImage({ fieldName: "image" }),
  (req, res, next) => {
    if (req.body?.isActive) {
      req.body.isActive = req.body.isActive === "true" ? true : false;
    }
    next();
  },
  validateRequest(categoriesPostValidation),
  categoriesController.postCategories
);
router.get("/get_all_category", categoriesController.getAllCategories);
router.get(
  "/get_single_category/:id",
  categoriesController.getSingleCategories
);
router.put(
  "/update_category/:id",
  authenticate,
  authorize(ROLE.ADMIN),
  getMuler({
    upload_file_destination_path: "uploads",
    regex: /\.(jpg|jpeg|png|webp)$/,
    images: "jpg, jpeg, png, webp",
  }).fields([{ name: "image", maxCount: 1 }]),

  configurableCompression("jpeg", 60),
  processImage({ fieldName: "image" }),
  handleImageUpdate({
    model: categoriesModel,
    imageField: "image",
    folderPath: "uploads",
  }),
  (req, res, next) => {
    if (req.body?.isActive) {
      req.body.isActive = req.body.isActive === "true" ? true : false;
    }
    next();
  },
  validateRequest(categoriesUpdateValidation),
  categoriesController.updateCategories
);
router.delete(
  "/delete_category/:id",
  authenticate,
  authorize(ROLE.ADMIN),
  categoriesController.deleteCategories
);

export const categoriesRoutes = router;
