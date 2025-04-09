import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { cartController } from "./cart.controller";
import { cartSchemaValidation, cartUpdateValidation } from "./cart.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  auth("user"),
  validateRequest(cartSchemaValidation),
  cartController.create
);
router.post("/remove_from_cart", auth("user"), cartController.removeFromCart);
router.get("/", auth("user"), cartController.getAll);
router.get("/admin_get_all_cart", cartController.adminGetAllCart);
router.get("/user_cart", auth("user"), cartController.getById);
router.put(
  "/:id",
  auth("user"),

  validateRequest(cartUpdateValidation),
  cartController.update
);
router.post("/product_cart_delete", auth("user"), cartController.delete);
router.delete("/bulk", auth("user"), cartController.bulkDelete);

export const cartRoutes = router;
