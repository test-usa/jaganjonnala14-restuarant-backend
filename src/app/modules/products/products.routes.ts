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

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
    "/post_products",
    authenticate,
    authorize(ROLE.VENDOR, ROLE.ADMIN),
    getMuler({
      upload_file_destination_path: "uploads",
      regex: /\.(jpg|jpeg|png|webp|mp4|mov)$/,
      images: "jpg, jpeg, png, webp",
    }).fields([
      { name: "images", maxCount: 10 },
      { name: "thumbnail", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
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
  
router.get("/get_all_products", productsController.getAllProducts);
router.get("/get_single_products/:id", productsController.getSingleProducts);
router.put(
  "/update_products/:id",
  validateRequest(productsUpdateValidation),
  productsController.updateProducts
);
router.delete("/delete_products/:id", productsController.deleteProducts);

export const productsRoutes = router;
