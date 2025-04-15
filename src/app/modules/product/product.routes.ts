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

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/create",
  uploadService.fields([
    { name: "productFeatureImage", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  configurableCompression("jpeg", 60),
  (req, res, next) => {
    try {
      const body: any = {
        ...req.body,

        // Set default values for fields if not provided
        productBuyingPrice: Number(req.body.productBuyingPrice) || 0,
        productSellingPrice: Number(req.body.productSellingPrice) || 0,
        productOfferPrice: Number(req.body.productOfferPrice) || 0,
        productStock: Number(req.body.productStock) || 0,
        isFeatured: req.body.isFeatured === "true" ? true : false,
        haveVarient: req.body.haveVarient === "true" ? true : false,

        // Fix ObjectId issue by checking the variant value
        variant:
          req.body.variant && req.body.variant !== "null"
            ? req.body.variant
            : null,

        // Default empty array for variantcolor if not provided
        variantcolor:
          req.body.variantcolor && req.body.variantcolor.length > 0
            ? JSON.parse(req.body.variantcolor)
            : [],

        // Check for productFeatureImage and set default if not provided
        productFeatureImage:
          req.files && (req.files as any).productFeatureImage
            ? (req.files as any).productFeatureImage[0].path
            : null,

        // Default empty array for productImages if not provided
        productImages:
          req.files && (req.files as any).productImages
            ? (req.files as any).productImages.map((f: any) => f.path)
            : [],
      };

      req.body = body;

      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something wrong from route.";
      res.status(400).json({ error: errorMessage });
    }
  },
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
  (req, res, next) => {
    try {
      const body: any = {
        ...req.body,

        // Set default values for fields if not provided
        productBuyingPrice: Number(req.body.productBuyingPrice) || 0,
        productSellingPrice: Number(req.body.productSellingPrice) || 0,
        productOfferPrice: Number(req.body.productOfferPrice) || 0,
        productStock: Number(req.body.productStock) || 0,
        isFeatured: req.body.isFeatured === "true" ? true : false,

        // Fix ObjectId issue by checking the variant value
        variant:
          req.body.variant && req.body.variant !== "null"
            ? req.body.variant
            : null,


        // Check for productFeatureImage and set default if not provided
        productFeatureImage:
          req.files && (req.files as any).productFeatureImage
            ? (req.files as any).productFeatureImage[0].path
            : null,

        // Default empty array for productImages if not provided
        productImages:
          req.files && (req.files as any).productImages
            ? (req.files as any).productImages.map((f: any) => f.path)
            : [],
      };

      req.body = body;
      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something wrong from route.";
      res.status(400).json({ error: errorMessage });
    }
  },
  validateRequest(productUpdateValidation),
  productController.update
);
router.delete("/:id", productController.delete);
router.post("/bulk", productController.bulkDelete);

export const productRoutes = router;
