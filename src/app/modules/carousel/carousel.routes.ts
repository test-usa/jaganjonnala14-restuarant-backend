import express from "express";
import { carouselController } from "./carousel.controller";
import { photoComposure } from "../../middlewares/photoComposure";
import { uploadService } from "../upload/upload";

const router = express.Router();
const { configurableCompression } = photoComposure();

router.post(
  "/createCarousel",
  uploadService.single("image"),
  configurableCompression("jpeg", 60),
  carouselController.create
);
router.get("/get-all", carouselController.getAll);
router.delete("/deleteCarousel/:id", carouselController.delete);

export const carouselRoutes = router;
