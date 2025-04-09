"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const photoComposure_1 = require("../../middlewares/photoComposure");
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
const { configurableCompression } = (0, photoComposure_1.photoComposure)();
router.post("/create", upload_1.uploadService.fields([
    { name: "productFeatureImage", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
]), configurableCompression("jpeg", 60), (req, res, next) => {
    try {
        const body = Object.assign(Object.assign({}, req.body), { 
            // Set default values for fields if not provided
            productBuyingPrice: Number(req.body.productBuyingPrice) || 0, productSellingPrice: Number(req.body.productSellingPrice) || 0, productOfferPrice: Number(req.body.productOfferPrice) || 0, productStock: Number(req.body.productStock) || 0, isFeatured: req.body.isFeatured === "true" ? true : false, haveVarient: req.body.haveVarient === "true" ? true : false, 
            // Fix ObjectId issue by checking the variant value
            variant: req.body.variant && req.body.variant !== "null"
                ? req.body.variant
                : null, 
            // Default empty array for variantcolor if not provided
            variantcolor: req.body.variantcolor && req.body.variantcolor.length > 0
                ? JSON.parse(req.body.variantcolor)
                : [], 
            // Check for productFeatureImage and set default if not provided
            productFeatureImage: req.files && req.files.productFeatureImage
                ? req.files.productFeatureImage[0].path
                : null, 
            // Default empty array for productImages if not provided
            productImages: req.files && req.files.productImages
                ? req.files.productImages.map((f) => f.path)
                : [] });
        req.body = body;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something wrong from route.";
        res.status(400).json({ error: errorMessage });
    }
}, (0, validateRequest_1.validateRequest)(product_validation_1.productValidation), product_controller_1.productController.create);
router.get("/", product_controller_1.productController.getAll);
router.get("/search-product", product_controller_1.productController.searchProducts);
router.get("/filter_products", product_controller_1.productController.filterProducts);
router.get("/products", product_controller_1.productController.getAllByCategory);
router.get("/get_product/:id", product_controller_1.productController.getById);
router.put("/update/:id", upload_1.uploadService.fields([
    { name: "productFeatureImage", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
]), configurableCompression("jpeg", 60), (req, res, next) => {
    try {
        const body = Object.assign(Object.assign({}, req.body), { 
            // Set default values for fields if not provided
            productBuyingPrice: Number(req.body.productBuyingPrice) || 0, productSellingPrice: Number(req.body.productSellingPrice) || 0, productOfferPrice: Number(req.body.productOfferPrice) || 0, productStock: Number(req.body.productStock) || 0, isFeatured: req.body.isFeatured === "true" ? true : false, haveVarient: req.body.haveVarient === "true" ? true : false, 
            // Fix ObjectId issue by checking the variant value
            variant: req.body.variant && req.body.variant !== "null"
                ? req.body.variant
                : null, 
            // Default empty array for variantcolor if not provided
            variantcolor: req.body.variantcolor && req.body.variantcolor.length > 0
                ? JSON.parse(req.body.variantcolor)
                : [], 
            // Check for productFeatureImage and set default if not provided
            productFeatureImage: req.files && req.files.productFeatureImage
                ? req.files.productFeatureImage[0].path
                : null, 
            // Default empty array for productImages if not provided
            productImages: req.files && req.files.productImages
                ? req.files.productImages.map((f) => f.path)
                : [] });
        req.body = body;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something wrong from route.";
        res.status(400).json({ error: errorMessage });
    }
}, (0, validateRequest_1.validateRequest)(product_validation_1.productUpdateValidation), product_controller_1.productController.update);
router.delete("/:id", product_controller_1.productController.delete);
router.post("/bulk", product_controller_1.productController.bulkDelete);
exports.productRoutes = router;
