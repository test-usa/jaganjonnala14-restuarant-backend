import express from "express";
import { reportsController } from "./reports.controller";

const router = express.Router();

router.get("/inventory-report", reportsController.inventoryReport);
router.get("/sales-report", reportsController.saleReport);
router.get("/dashboard-summmary", reportsController.getDashboardSummary);


export const reportsRoutes = router;