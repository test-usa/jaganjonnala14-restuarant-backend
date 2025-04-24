import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { attributeController } from "./attribute.controller";
import {
  attributePostValidation,
  attributeUpdateValidation,
} from "./attribute.validation";

const router = express.Router();

router.post(
  "/post_attribute",
  validateRequest(attributePostValidation),
  attributeController.postAttribute
);
router.get("/get_all_attribute", attributeController.getAllAttribute);
router.get("/get_single_attribute/:id", attributeController.getSingleAttribute);
router.put(
  "/update_attribute/:id",
  validateRequest(attributeUpdateValidation),
  attributeController.updateAttribute
);
router.delete("/delete_attribute/:id", attributeController.deleteAttribute);

export const attributeRoutes = router;
