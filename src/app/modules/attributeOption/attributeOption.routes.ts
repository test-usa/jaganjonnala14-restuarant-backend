import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  AttributeOptionValidationSchema,
  updateAttributeOptionValidationSchema,
} from "./attributeOption.validation";
import { AttributeOptionController } from "./attributeOption.controller";

const router = express.Router();

router.post(
  "/post_attributeOption",
  validateRequest(AttributeOptionValidationSchema),
  AttributeOptionController.postAttributeOption
);
router.put(
  "/put_attributeOption/:id",
  validateRequest(updateAttributeOptionValidationSchema),
  AttributeOptionController.putAttributeOption
);
router.get(
  "/get_attributeOption",
  AttributeOptionController.getAttributeOption
);
router.delete(
  "/delete_attributeOption/:id",
  AttributeOptionController.deleteAttributeOption
);

export const attributeOptionRoutes = router;
