import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { expenseController } from "./expense.controller";
import { expenseValidation } from "./expense.validation";

const router = express.Router();

router.post("/create", validateRequest(expenseValidation), expenseController.create);
router.get("/", expenseController.getAll);
router.get("/:id", expenseController.getById);
router.put("/:id", validateRequest(expenseUpdateValidation), expenseController.update);
router.delete("/:id", expenseController.delete);
router.delete("/bulk", expenseController.bulkDelete);

export const expenseRoutes = router;