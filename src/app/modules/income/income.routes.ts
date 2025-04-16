import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { incomeController } from "./income.controller";
import { incomeValidation } from "./income.validation";

const router = express.Router();

router.post("/create", validateRequest(incomeValidation), incomeController.create);
router.get("/", incomeController.getAll);
router.get("/:id", incomeController.getById);
router.put("/:id", validateRequest(incomeUpdateValidation), incomeController.update);
router.delete("/:id", incomeController.delete);
router.delete("/bulk", incomeController.bulkDelete);

export const incomeRoutes = router;