"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const floor_controller_1 = require("./floor.controller");
const floor_validation_1 = require("./floor.validation");
const router = express_1.default.Router();
router.post("/create-floor", (0, validateRequest_1.validateRequest)(floor_validation_1.floorPostValidation), floor_controller_1.floorController.postFloor);
router.get("/all-floor", floor_controller_1.floorController.getAllFloor);
router.get("/single-floor/:id", floor_controller_1.floorController.getSingleFloor);
router.put("/update-floor/:id", (0, validateRequest_1.validateRequest)(floor_validation_1.floorUpdateValidation), floor_controller_1.floorController.updateFloor);
router.delete("/delete-floor/:id", floor_controller_1.floorController.deleteFloor);
exports.floorRoutes = router;
