// brand.routes.ts - brand module
// categories.routes.ts - categories module
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import { uploadService } from "../upload/upload";
import { photoComposure } from "../../middlewares/photoComposure";
import { BrandValidation, BrandValidationPut } from "./brand.validation";
import { brandController } from "./brand.controller";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/post_brand",
  uploadService.single("image"),

  configurableCompression("jpeg", 60),

  validateRequest(BrandValidation),
  brandController.postbrand
);
router.put(
  "/put_brand/:id",
  uploadService.single("image"),
  configurableCompression("jpeg", 60),
  validateRequest(BrandValidationPut),
  brandController.updatebrand
);
router.get("/get_brands", brandController.getbrands);
router.get("/get_brand/:id", brandController.getbrandById);
router.delete("/delete_brand/:id", brandController.deletebrand);
router.post("/delete_bulk", brandController.BulkDelete);

export const brandRoutes = router;
