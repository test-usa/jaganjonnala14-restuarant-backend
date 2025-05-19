"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const adminAnalytics_controller_1 = require("./adminAnalytics.controller");
const router = express_1.default.Router();
router.get('/all-admin-analytics', adminAnalytics_controller_1.adminAnalyticController.AdminAnalytics);
exports.AdminAnalyticsRoutes = router;
