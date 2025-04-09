import express from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create", auth("user"), wishlistController.create);
router.get("/admin_get_wishlists", wishlistController.getAll);
router.get("/for_single_user",auth("user"), wishlistController.getById);
router.put("/:id",auth("user"), wishlistController.update);
router.post("/",auth("user"), wishlistController.delete);
router.delete("/softDelete/:id", wishlistController.adminDeleteWishlist);
router.delete("/bulk",auth("user"), wishlistController.bulkDelete);

export const wishlistRoutes = router;