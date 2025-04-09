"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeOptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const attributeOption_validation_1 = require("./attributeOption.validation");
const attributeOption_controller_1 = require("./attributeOption.controller");
const router = express_1.default.Router();
router.post("/post_attributeOption", (0, validateRequest_1.validateRequest)(attributeOption_validation_1.AttributeOptionValidationSchema), attributeOption_controller_1.AttributeOptionController.postAttributeOption);
router.put("/put_attributeOption/:id", (0, validateRequest_1.validateRequest)(attributeOption_validation_1.updateAttributeOptionValidationSchema), attributeOption_controller_1.AttributeOptionController.putAttributeOption);
router.get("/get_attributeOption", attributeOption_controller_1.AttributeOptionController.getAttributeOption);
router.delete("/delete_attributeOption/:id", attributeOption_controller_1.AttributeOptionController.deleteAttributeOption);
exports.attributeOptionRoutes = router;
