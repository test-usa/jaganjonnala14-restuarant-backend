"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantLayoutRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const restaurantLayout_controller_1 = require("./restaurantLayout.controller");
const restaurantLayout_validation_1 = require("./restaurantLayout.validation");
const router = express_1.default.Router();
router.post("/create-restaurant-layout", (0, validateRequest_1.validateRequest)(restaurantLayout_validation_1.restaurantLayoutPostValidation), restaurantLayout_controller_1.restaurantLayoutController.postRestaurantLayout);
router.get("/all-restaurant-layout", restaurantLayout_controller_1.restaurantLayoutController.getAllRestaurantLayout);
router.get("/single-restaurant-layout/:id", restaurantLayout_controller_1.restaurantLayoutController.getSingleRestaurantLayout);
router.put("/update-restaurant-layout/:id", (0, validateRequest_1.validateRequest)(restaurantLayout_validation_1.restaurantLayoutUpdateValidation), restaurantLayout_controller_1.restaurantLayoutController.updateRestaurantLayout);
router.delete("/delete-restaurant-layout/:id", restaurantLayout_controller_1.restaurantLayoutController.deleteRestaurantLayout);
exports.restaurantLayoutRoutes = router;
