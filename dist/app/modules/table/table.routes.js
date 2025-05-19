"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const table_controller_1 = require("./table.controller");
const table_validation_1 = require("./table.validation");
const router = express_1.default.Router();
router.post("/create-table", (0, validateRequest_1.validateRequest)(table_validation_1.tablePostValidation), table_controller_1.tableController.postTable);
router.get("/all-table", table_controller_1.tableController.getAllTable);
router.get("/single-table/:id", table_controller_1.tableController.getSingleTable);
router.put("/update-table/:id", (0, validateRequest_1.validateRequest)(table_validation_1.tableUpdateValidation), table_controller_1.tableController.updateTable);
router.delete("/delete-table/:id", table_controller_1.tableController.deleteTable);
exports.tableRoutes = router;
