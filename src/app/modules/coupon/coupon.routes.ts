import express from "express";
import { couponController } from "./coupon.controller";

const router = express.Router();

router.post("/create",  couponController.create);
router.get("/get-all", couponController.getAll);
router.get("/:id", couponController.getById);
router.put("/update/:id", couponController.update);
router.post("/delete/:id", couponController.delete);

router.post("/apply", couponController.couponApply);


export const couponRoutes = router;