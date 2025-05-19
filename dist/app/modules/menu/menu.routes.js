"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const menu_controller_1 = require("./menu.controller");
const menu_validation_1 = require("./menu.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post("/create-menu", sendImageToCloudinary_1.upload.single('image'), (req, res, next) => {
    next();
}, menu_controller_1.menuController.postMenu);
router.get("/all-menu", menu_controller_1.menuController.getAllMenu);
router.get("/single-menu/:id", menu_controller_1.menuController.getSingleMenu);
router.get("/restaurant-menu/:restaurantId", menu_controller_1.menuController.MenuWithRestaurant);
router.put("/update-menu/:id", (0, validateRequest_1.validateRequest)(menu_validation_1.menuUpdateValidation), menu_controller_1.menuController.updateMenu);
router.delete("/delete-menu/:id", menu_controller_1.menuController.deleteMenu);
exports.menuRoutes = router;
