"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carouselRoutes = void 0;
const express_1 = __importDefault(require("express"));
const carousel_controller_1 = require("./carousel.controller");
const photoComposure_1 = require("../../middlewares/photoComposure");
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
const { configurableCompression } = (0, photoComposure_1.photoComposure)();
router.post("/createCarousel", upload_1.uploadService.single("image"), configurableCompression("jpeg", 60), carousel_controller_1.carouselController.create);
router.get("/get-all", carousel_controller_1.carouselController.getAll);
router.delete("/deleteCarousel/:id", carousel_controller_1.carouselController.delete);
exports.carouselRoutes = router;
