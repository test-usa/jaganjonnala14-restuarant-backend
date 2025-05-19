import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";

import { userInputSchema, usersUpdateValidation } from "./users.validation";
import { userController } from "./users.controller";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userInputSchema),
  userController.createUser
);

router.get("/all-users", userController.getAllUsers);

router.get("/single-user/:id", userController.getSingleUser);

router.put(
  "/update-user/:id",
  validateRequest(usersUpdateValidation),
  userController.updateUser
);

router.delete("/delete-user/:id", userController.deleteUser);

export const usersRoutes = router;
