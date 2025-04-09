"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giftCardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const giftCard_controller_1 = require("./giftCard.controller");
const giftCard_validation_1 = require("./giftCard.validation");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.validateRequest)(giftCard_validation_1.giftCardValidation), giftCard_controller_1.giftCardController.create);
router.get("/", giftCard_controller_1.giftCardController.getAll);
router.get("/:id", giftCard_controller_1.giftCardController.getById);
router.put("/:id", giftCard_controller_1.giftCardController.update);
router.delete("/:id", giftCard_controller_1.giftCardController.delete);
router.delete("/bulk", giftCard_controller_1.giftCardController.bulkDelete);
exports.giftCardRoutes = router;
