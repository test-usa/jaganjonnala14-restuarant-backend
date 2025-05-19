"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/register-restuarant-owner", (0, validateRequest_1.validateRequest)(auth_validation_1.restaurantValidationRequest), auth_controller_1.authController.restuarantRegisterRequest);
router.post("/verify-otp", auth_controller_1.authController.otpValidation);
router.post("/resend-otp", auth_controller_1.authController.resendOtp);
router.post("/forgot-password", auth_controller_1.authController.forgotPassword);
router.post("/verify-password-otp", auth_controller_1.authController.verifyResetOtp);
router.post("/reset-password", auth_controller_1.authController.resetPassword);
router.post("/approved-restaurant-admin", auth_controller_1.authController.approveRestaurantByAdmin);
// Google OAuth
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/login" }), auth_controller_1.authController.OAuthCallback);
// Facebook OAuth
router.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["email"], session: false }));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", { session: false, failureRedirect: "/login" }), auth_controller_1.authController.OAuthCallback);
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.authLoginValidation), auth_controller_1.authController.Login);
router.post("/logout", auth_controller_1.authController.Logout);
exports.authRoutes = router;
