"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const owner_controller_1 = require("./owner.controller");
const owner_validation_1 = require("./owner.validation");
const router = express_1.default.Router();
router.post("/post_owner", (0, validateRequest_1.validateRequest)(owner_validation_1.ownerPostValidation), owner_controller_1.ownerController.postOwner);
router.get("/get_all_owner", owner_controller_1.ownerController.getAllOwner);
router.get("/get_single_owner/:id", owner_controller_1.ownerController.getSingleOwner);
router.put("/update_owner/:id", (0, validateRequest_1.validateRequest)(owner_validation_1.ownerUpdateValidation), owner_controller_1.ownerController.updateOwner);
router.delete("/delete_owner/:id", owner_controller_1.ownerController.deleteOwner);
exports.ownerRoutes = router;
