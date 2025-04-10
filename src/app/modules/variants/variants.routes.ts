import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { variantsController } from "./variants.controller";
import { variantsUpdateValidation, variantsValidation } from "./variants.validation";

const router = express.Router();

router.post("/create", validateRequest(variantsValidation), variantsController.create);
router.get("/", variantsController.getAll);
router.get("/:id", variantsController.getById);
router.put("/:id", validateRequest(variantsUpdateValidation), variantsController.update);
router.delete("/:id", variantsController.delete);
router.delete("/bulk-delete", variantsController.bulkDelete);

export const variantsRoutes = router;