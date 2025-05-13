import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { staffController } from "./staff.controller";
import { staffPostValidation, staffUpdateValidation } from "./staff.validation";

const router = express.Router();

router.post(
  "/post_staff",
  validateRequest(staffPostValidation),
  staffController.postStaff
);
router.get("/get_all_staff", staffController.getAllStaff);
router.get("/get_single_staff/:id", staffController.getSingleStaff);
router.put(
  "/update_staff/:id",
  validateRequest(staffUpdateValidation),
  staffController.updateStaff
);
router.delete("/delete_staff/:id", staffController.deleteStaff);

export const staffRoutes = router;
