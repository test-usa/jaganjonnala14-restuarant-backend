import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { usersController } from "./users.controller";
import { userInputSchema, usersUpdateValidation } from "./users.validation";

const router = express.Router();

router.post(
  "/post_users",
  validateRequest(userInputSchema),
  usersController.postUsers
);

router.get("/get_all_users", usersController.getAllUsers);
router.get("/get_single_users/:id", usersController.getSingleUsers);
router.put(
  "/update_users/:id",
  validateRequest(usersUpdateValidation),
  usersController.updateUsers
);
router.delete("/delete_users/:id", usersController.deleteUsers);

export const usersRoutes = router;
