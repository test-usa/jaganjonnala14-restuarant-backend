"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRoutes = void 0;
const express_1 = __importDefault(require("express"));
const staff_controller_1 = require("./staff.controller");
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post("/create-staff", sendImageToCloudinary_1.upload.single("image"), staff_controller_1.staffController.createStaff);
router.get("/all-staff", staff_controller_1.staffController.getAllStaff);
router.get("/single-staff/:id", staff_controller_1.staffController.getSingleStaff);
router.put("/update-staff/:id", sendImageToCloudinary_1.upload.single('image'), staff_controller_1.staffController.updateStaff);
router.delete("/delete-staff/:id", staff_controller_1.staffController.deleteStaff);
exports.staffRoutes = router;
