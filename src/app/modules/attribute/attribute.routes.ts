// attribute.routes.ts - attribute module
import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import { AttributeController } from "./attribute.controller";
import { AttributeValidationPostSchema, AttributeValidationPutSchema } from "./attribute.validation";

const router = express.Router();

router.post(
  "/post_attribute",
  validateRequest(AttributeValidationPostSchema),
  AttributeController.postAttribute
);
router.put(
  "/put_attribute/:id",
  validateRequest(AttributeValidationPutSchema),
  AttributeController.putAttribute
);
router.get(
  "/get_attribute",
  AttributeController.getAttribute
);
router.delete(
  "/delete_attribute/:id",
  AttributeController.deleteAttribute
);

export const attributeRoutes = router;
