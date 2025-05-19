"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restuarantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const restaurant_controller_1 = require("./restaurant.controller");
const router = express_1.default.Router();
router.post("/create-restaurant", sendImageToCloudinary_1.upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
]), restaurant_controller_1.restuarantController.postRestuarant);
router.put("/update-restaurant/:id", sendImageToCloudinary_1.upload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
]), restaurant_controller_1.restuarantController.updateRestuarant);
router.get("/all-restaurant", restaurant_controller_1.restuarantController.getAllRestuarant);
router.get("/single-restaurant/:id", restaurant_controller_1.restuarantController.getSingleRestuarant);
// router.put("/update-restaurant/:id", validateRequest(restuarantUpdateValidation), restuarantController.updateRestuarant);
router.delete("/delete-restaurant/:id", restaurant_controller_1.restuarantController.deleteRestuarant);
exports.restuarantRoutes = router;
