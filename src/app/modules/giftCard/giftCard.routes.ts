import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { giftCardController } from "./giftCard.controller";
import { giftCardValidation } from "./giftCard.validation";

const router = express.Router();

router.post("/create", validateRequest(giftCardValidation), giftCardController.create);
router.get("/", giftCardController.getAll);
router.get("/:id", giftCardController.getById);
router.put("/:id", giftCardController.update);
router.delete("/:id", giftCardController.delete);
router.delete("/bulk", giftCardController.bulkDelete);

export const giftCardRoutes = router;