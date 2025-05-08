import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { productsController } from "./products.controller";
import {
  productsPostValidation,
  productsUpdateValidation,
} from "./products.validation";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { ROLE } from "../../constant/role";
import { getMuler } from "../../middlewares/multer";
import { photoComposure } from "../../middlewares/photoComposure";
import { processMedia } from "../../middlewares/processMedia";
import { updateProductProcessMedia } from "../../middlewares/updateProductProcessMedia";
import { handleImageUpdate } from "../../middlewares/handleImageUpdate";
import { productsModel } from "./products.model";
import { handleMultipleFile } from "../../middlewares/handleMultipleFile";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
    "/post_product",
    authenticate,
    authorize(ROLE.ADMIN),
    getMuler({
      upload_file_destination_path: "uploads",
      regex: /\.(jpg|jpeg|png|webp|mp4|mov)$/,
      images: "jpg, jpeg, png, webp",
    }).fields([
      { name: "images", maxCount: 10 },
      { name: "thumbnail", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
    (req, res, next) => {
      req.body = {
        ...req.body,
        shipping : JSON.parse(req.body.shipping)
      }
      next()
    },
    configurableCompression("jpeg", 60), // optional for images
    processMedia({
      fields: [
        { fieldName: "images", isMultiple: true },
        { fieldName: "thumbnail" },
        { fieldName: "video" },
      ],
    }),
    validateRequest(productsPostValidation),
    productsController.postProducts
  );
  
router.get("/get_all_product", productsController.getAllProducts);
router.get("/get_single_product/:id", productsController.getSingleProducts);
router.put(
  "/update_product/:id",
  authenticate,
  authorize(ROLE.ADMIN),
  getMuler({
    upload_file_destination_path: "uploads",
    regex: /\.(jpg|jpeg|png|webp|mp4|mov)$/,
    images: "jpg, jpeg, png, webp",
  }).fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res, next) => {
    req.body = {
      ...req.body,
      shipping : JSON?.parse(req?.body?.shipping) 
    }
    next()
  },
  configurableCompression("jpeg", 60), // optional for images
  updateProductProcessMedia({
    fields: [
      { fieldName: "images", isMultiple: true },
      { fieldName: "thumbnail" },
      { fieldName: "video" },
    ],
  }),
    handleImageUpdate({
      model: productsModel,
      imageField: "thumbnail",
      folderPath: "uploads",
    }),
    handleImageUpdate({
      model: productsModel,
      imageField: "video",
      folderPath: "uploads",
    }),
 
    handleMultipleFile({
      model: productsModel,
      fileField: "images",
      folderPath: "uploads",
    }),

  validateRequest(productsUpdateValidation),
  productsController.updateProducts
);
router.delete("/delete_product/:id",  authenticate,
  authorize(ROLE.ADMIN), productsController.deleteProducts);
router.get("/get_products_by_category/:id", productsController.getProductsByCategory)

export const productsRoutes = router;
