"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("./wishlist.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)("user"), wishlist_controller_1.wishlistController.create);
router.get("/admin_get_wishlists", wishlist_controller_1.wishlistController.getAll);
router.get("/for_single_user", (0, auth_1.default)("user"), wishlist_controller_1.wishlistController.getById);
router.put("/:id", (0, auth_1.default)("user"), wishlist_controller_1.wishlistController.update);
router.post("/", (0, auth_1.default)("user"), wishlist_controller_1.wishlistController.delete);
router.delete("/softDelete/:id", wishlist_controller_1.wishlistController.adminDeleteWishlist);
router.delete("/bulk", (0, auth_1.default)("user"), wishlist_controller_1.wishlistController.bulkDelete);
exports.wishlistRoutes = router;
