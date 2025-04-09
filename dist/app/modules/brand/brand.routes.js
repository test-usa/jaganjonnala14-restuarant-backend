"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoutes = void 0;
// brand.routes.ts - brand module
// categories.routes.ts - categories module
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const upload_1 = require("../upload/upload");
const photoComposure_1 = require("../../middlewares/photoComposure");
const brand_validation_1 = require("./brand.validation");
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
const { configurableCompression } = (0, photoComposure_1.photoComposure)();
router.post("/post_brand", upload_1.uploadService.single("image"), configurableCompression("jpeg", 60), (0, validateRequest_1.validateRequest)(brand_validation_1.BrandValidation), brand_controller_1.brandController.postbrand);
router.put("/put_brand/:id", upload_1.uploadService.single("image"), configurableCompression("jpeg", 60), (0, validateRequest_1.validateRequest)(brand_validation_1.BrandValidationPut), brand_controller_1.brandController.updatebrand);
router.get("/get_brands", brand_controller_1.brandController.getbrands);
router.get("/get_brand/:id", brand_controller_1.brandController.getbrandById);
router.delete("/delete_brand/:id", brand_controller_1.brandController.deletebrand);
router.post("/delete_bulk", brand_controller_1.brandController.BulkDelete);
exports.brandRoutes = router;
