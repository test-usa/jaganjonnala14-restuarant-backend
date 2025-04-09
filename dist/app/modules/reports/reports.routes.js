"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const reports_controller_1 = require("./reports.controller");
const router = express_1.default.Router();
router.get("/inventory-report", reports_controller_1.reportsController.inventoryReport);
router.get("/sales-report", reports_controller_1.reportsController.saleReport);
router.get("/dashboard-summmary", reports_controller_1.reportsController.getDashboardSummary);
exports.reportsRoutes = router;
