/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { productController } from "./product.controller";
import {
  productUpdateValidation,
  productValidation,
} from "./product.validation";
import { photoComposure } from "../../middlewares/photoComposure";
import { uploadService } from "../upload/upload";
import { prepareProductData } from "../../utils/prepareProductData";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/create",
  uploadService.fields([
    { name: "productFeatureImage", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  configurableCompression("jpeg", 60),
  prepareProductData,
  validateRequest(productValidation),
  productController.create
);

router.get("/", productController.getAll);
router.get("/search-product", productController.searchProducts);
router.get("/filter_products", productController.filterProducts);
router.get("/products", productController.getAllByCategory);
router.get("/get_product/:id", productController.getById);
router.put(
  "/update/:id",
  uploadService.fields([
    { name: "productFeatureImage", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  configurableCompression("jpeg", 60),
  prepareProductData,

  validateRequest(productUpdateValidation),
  productController.update
);
router.delete("/:id", productController.delete);
router.post("/bulk", productController.bulkDelete);

export const productRoutes = router;
