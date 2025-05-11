import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authLoginValidation, authRegisterValidation } from "./auth.validation";
import hashPassword from "../../middlewares/hashPassword";
import passport from 'passport';


const router = express.Router();

router.post(
  "/register",
  validateRequest(authRegisterValidation),
  hashPassword,
  authController.Register
);

// Google Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); // Redirect to homepage or dashboard
  }
);

// Facebook Auth
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.post(
  "/login",
  validateRequest(authLoginValidation),
  authController.Login
);
router.post(
  "/logout",
  authController.Logout
);

export const authRoutes = router;
