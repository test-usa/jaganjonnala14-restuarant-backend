"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.post("/create", coupon_controller_1.couponController.create);
router.get("/get-all", coupon_controller_1.couponController.getAll);
router.get("/:id", coupon_controller_1.couponController.getById);
router.put("/update/:id", coupon_controller_1.couponController.update);
router.post("/delete/:id", coupon_controller_1.couponController.delete);
router.post("/apply", coupon_controller_1.couponController.couponApply);
exports.couponRoutes = router;
