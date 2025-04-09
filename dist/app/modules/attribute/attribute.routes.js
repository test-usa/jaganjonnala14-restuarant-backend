"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeRoutes = void 0;
// attribute.routes.ts - attribute module
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const attribute_controller_1 = require("./attribute.controller");
const attribute_validation_1 = require("./attribute.validation");
const router = express_1.default.Router();
router.post("/post_attribute", (0, validateRequest_1.validateRequest)(attribute_validation_1.AttributeValidationPostSchema), attribute_controller_1.AttributeController.postAttribute);
router.put("/put_attribute/:id", (0, validateRequest_1.validateRequest)(attribute_validation_1.AttributeValidationPutSchema), attribute_controller_1.AttributeController.putAttribute);
router.get("/get_attribute", attribute_controller_1.AttributeController.getAttribute);
router.delete("/delete_attribute/:id", attribute_controller_1.AttributeController.deleteAttribute);
exports.attributeRoutes = router;
