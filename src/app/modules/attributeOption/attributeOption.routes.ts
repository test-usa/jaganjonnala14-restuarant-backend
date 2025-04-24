import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { attributeOptionController } from "./attributeOption.controller";
import {
  attributeOptionPostValidation,
  attributeOptionUpdateValidation,
} from "./attributeOption.validation";
import { photoComposure } from "../../middlewares/photoComposure";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { ROLE } from "../../constant/role";
import { getMuler } from "../../middlewares/multer";
import { processImage } from "../../middlewares/processImage";
import { handleImageUpdate } from "../../middlewares/handleImageUpdate";
import { attributeOptionModel } from "./attributeOption.model";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/post_attribute_option",
  // authenticate,
  // authorize(ROLE.ADMIN),
  getMuler({
    upload_file_destination_path: "uploads",
    regex: /\.(jpg|jpeg|png|webp)$/,
    images: "jpg, jpeg, png, webp",
  }).fields([{ name: "image", maxCount: 1 }]),

  configurableCompression("jpeg", 60),
  processImage({ fieldName: "image" }),
  validateRequest(attributeOptionPostValidation),
  attributeOptionController.postAttributeOption
);
router.get(
  "/get_all_attribute_option",
  attributeOptionController.getAllAttributeOption
);
router.get(
  "/get_single_attribute_option/:id",
  attributeOptionController.getSingleAttributeOption
);
router.put(
  "/update_attribute_option/:id",
  // authenticate,
  //   authorize(ROLE.ADMIN, ROLE.VENDOR),
    getMuler({
      upload_file_destination_path: "uploads",
      regex: /\.(jpg|jpeg|png|webp)$/,
      images: "jpg, jpeg, png, webp",
    }).fields([
      { name: "image", maxCount: 1 }, 
    ]),
    configurableCompression("jpeg", 60),
    processImage({ fieldName: "image" }),
    handleImageUpdate({
      model: attributeOptionModel,
      imageField: "image",
      folderPath: "uploads",
    }),
  validateRequest(attributeOptionUpdateValidation),
  attributeOptionController.updateAttributeOption
);
router.delete(
  "/delete_attribute_option/:id",
  attributeOptionController.deleteAttributeOption
);

export const attributeOptionRoutes = router;
