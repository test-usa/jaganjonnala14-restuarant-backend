"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const analytic_controller_1 = require("./analytic.controller");
const router = express_1.default.Router();
router.get('/all-analytics/:id', analytic_controller_1.analyticController.analytics);
exports.analyticsRoutes = router;
