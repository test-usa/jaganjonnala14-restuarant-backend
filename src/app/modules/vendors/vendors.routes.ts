import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { vendorsController } from "./vendors.controller";
import {
  vendorsPostValidation,
  vendorsUpdateValidation,
} from "./vendors.validation";
import hashPassword from "../../middlewares/hashPassword";
import { getMuler } from "../../middlewares/multer";
import { processImage } from "../../middlewares/processImage";
import { photoComposure } from "../../middlewares/photoComposure";
import { checkVendorAndCleanLogoUpload } from "../../middlewares/checkVendorAndCleanLogoUpload";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { ROLE } from "../../constant/role";
import { handleImageUpdate } from "../../middlewares/handleImageUpdate";
import { vendorsModel } from "./vendors.model";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/vendor_request",
  getMuler({
    upload_file_destination_path: "uploads",
    regex: /\.(jpg|jpeg|png|webp)$/,
    images: "jpg, jpeg, png, webp",
  }).fields([{ name: "logo", maxCount: 1 }]),

  configurableCompression("jpeg", 60),
  processImage({ fieldName: "logo" }),
  checkVendorAndCleanLogoUpload,
  validateRequest(vendorsPostValidation),
  hashPassword,
  vendorsController.postVendors
);
router.get("/get_all_varified_vendors", vendorsController.getAllVendors);
router.get("/get_single_vendors/:id", vendorsController.getSingleVendors);
router.put(
  "/update_vendors/:id",

    authenticate,
    authorize(ROLE.ADMIN, ROLE.VENDOR),
    getMuler({
      upload_file_destination_path: "uploads",
      regex: /\.(jpg|jpeg|png|webp)$/,
      images: "jpg, jpeg, png, webp",
    }).fields([
      { name: "logo", maxCount: 1 }, 
    ]),
    configurableCompression("jpeg", 60),
    processImage({ fieldName: "logo" }),
    handleImageUpdate({
      model: vendorsModel,
      imageField: "logo",
      folderPath: "uploads",
    }),
  validateRequest(vendorsUpdateValidation),
  vendorsController.updateVendors
);
router.delete("/delete_vendors/:id", vendorsController.deleteVendors);

export const vendorsRoutes = router;
