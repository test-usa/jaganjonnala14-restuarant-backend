"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantZoneRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const restaurantZone_controller_1 = require("./restaurantZone.controller");
const restaurantZone_validation_1 = require("./restaurantZone.validation");
const router = express_1.default.Router();
router.post("/create-zone", (0, validateRequest_1.validateRequest)(restaurantZone_validation_1.restaurantZoneValidationSchema), restaurantZone_controller_1.restaurantZoneTypeController.postRestaurantZoneType);
router.get("/all-zone", restaurantZone_controller_1.restaurantZoneTypeController.getAllRestaurantZoneType);
router.get("/single-zone", restaurantZone_controller_1.restaurantZoneTypeController.getSingleRestaurantZoneType);
router.put("/update-zone/:id", (0, validateRequest_1.validateRequest)(restaurantZone_validation_1.restaurantZoneUpdateValidation), restaurantZone_controller_1.restaurantZoneTypeController.updateRestaurantZoneType);
router.delete("/delete-zone/:id", restaurantZone_controller_1.restaurantZoneTypeController.deleteRestaurantZoneType);
exports.restaurantZoneRoutes = router;
