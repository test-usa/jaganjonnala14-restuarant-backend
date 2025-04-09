import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { unitController } from "./unit.controller";
import { unitUpdateValidation, unitValidation } from "./unit.validation";

const router = express.Router();

router.post("/create", validateRequest(unitValidation), unitController.create);
router.get("/", unitController.getAll);
router.get("/:id", unitController.getById);
router.put("/:id", validateRequest(unitUpdateValidation), unitController.update);
router.delete("/:id", unitController.delete);
router.delete("/bulk-delete", unitController.bulkDelete);

export const unitRoutes = router;