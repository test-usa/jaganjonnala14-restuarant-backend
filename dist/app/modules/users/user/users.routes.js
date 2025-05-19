"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const users_validation_1 = require("./users.validation");
const users_controller_1 = require("./users.controller");
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post("/create-user", (0, validateRequest_1.validateRequest)(users_validation_1.userInputSchema), users_controller_1.userController.createUser);
router.get("/all-users", users_controller_1.userController.getAllUsers);
router.get("/single-user/:id", users_controller_1.userController.getSingleUser);
router.put("/update-user/:id", sendImageToCloudinary_1.upload.single('image'), (0, validateRequest_1.validateRequest)(users_validation_1.usersUpdateValidation), users_controller_1.userController.updateUser);
router.delete("/delete-user/:id", users_controller_1.userController.deleteUser);
exports.usersRoutes = router;
