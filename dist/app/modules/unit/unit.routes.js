"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const unit_controller_1 = require("./unit.controller");
const unit_validation_1 = require("./unit.validation");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.validateRequest)(unit_validation_1.unitValidation), unit_controller_1.unitController.create);
router.get("/", unit_controller_1.unitController.getAll);
router.get("/:id", unit_controller_1.unitController.getById);
router.put("/:id", (0, validateRequest_1.validateRequest)(unit_validation_1.unitUpdateValidation), unit_controller_1.unitController.update);
router.delete("/:id", unit_controller_1.unitController.delete);
router.delete("/bulk-delete", unit_controller_1.unitController.bulkDelete);
exports.unitRoutes = router;
