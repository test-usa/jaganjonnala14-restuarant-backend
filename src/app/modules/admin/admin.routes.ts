import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { adminPostValidation, adminUpdateValidation } from "./admin.validation";
import { authenticate, authorize } from "../../middlewares/authGuard";
import { ROLE } from "../../constant/role";
import hashPassword from "../../middlewares/hashPassword";

const router = express.Router();
router.post(
  "/admin_create_manager",
  authenticate,
  authorize(ROLE.ADMIN),
  hashPassword,
  adminController.createManager
);

router.post(
  "/post_admin",
  validateRequest(adminPostValidation),
  adminController.postAdmin
);
router.get("/get_all_admin", adminController.getAllAdmin);
router.get("/get_single_admin/:id", adminController.getSingleAdmin);
router.put(
  "/update_admin/:id",
  validateRequest(adminUpdateValidation),
  adminController.updateAdmin
);
router.delete("/delete_admin/:id", adminController.deleteAdmin);

export const adminRoutes = router;
