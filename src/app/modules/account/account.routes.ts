import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { accountController } from "./account.controller";
import { accountValidation } from "./account.validation";

const router = express.Router();

router.post("/create", validateRequest(accountValidation), accountController.create);
router.get("/", accountController.getAll);
router.get("/:id", accountController.getById);
router.put("/:id", validateRequest(accountUpdateValidation), accountController.update);
router.delete("/:id", accountController.delete);
router.delete("/bulk", accountController.bulkDelete);

export const accountRoutes = router;