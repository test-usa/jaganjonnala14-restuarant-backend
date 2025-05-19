"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post("/create-order", (0, validateRequest_1.validateRequest)(order_validation_1.orderPostValidation), order_controller_1.orderController.createOrder);
router.get("/all-order", order_controller_1.orderController.getAllOrders);
router.get("/single-order/:id", order_controller_1.orderController.getSingleOrder);
router.put("/update-order/:id", (0, validateRequest_1.validateRequest)(order_validation_1.orderUpdateValidation), order_controller_1.orderController.updateOrder);
router.delete("/delete-order/:id", order_controller_1.orderController.deleteOrder);
exports.orderRoutes = router;
