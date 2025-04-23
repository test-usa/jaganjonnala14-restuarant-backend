import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authLoginValidation, authRegisterValidation } from "./auth.validation";
import hashPassword from "../../middlewares/hashPassword";

const router = express.Router();

router.post(
  "/register",
  validateRequest(authRegisterValidation),
  hashPassword,
  authController.Register
);


router.post(
  "/login",
  validateRequest(authLoginValidation),
  authController.Login
);

export const authRoutes = router;
