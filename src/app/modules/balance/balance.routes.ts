import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { balanceController } from "./balance.controller";
import { balanceValidation } from "./balance.validation";

const router = express.Router();

router.post("/create", validateRequest(balanceValidation), balanceController.create);
router.get("/", balanceController.getAll);
router.get("/:id", balanceController.getById);
router.put("/:id", validateRequest(balanceUpdateValidation), balanceController.update);
router.delete("/:id", balanceController.delete);
router.delete("/bulk", balanceController.bulkDelete);

export const balanceRoutes = router;