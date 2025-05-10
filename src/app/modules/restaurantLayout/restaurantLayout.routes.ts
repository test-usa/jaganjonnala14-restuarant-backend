
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restaurantLayoutController } from "./restaurantLayout.controller";
    import { restaurantLayoutPostValidation,restaurantLayoutUpdateValidation } from "./restaurantLayout.validation";

    const router = express.Router();
    
    router.post("/post_restaurantLayout", validateRequest(restaurantLayoutPostValidation), restaurantLayoutController.postRestaurantLayout);
    router.get("/get_all_restaurantLayout", restaurantLayoutController.getAllRestaurantLayout);
    router.get("/get_single_restaurantLayout/:id", restaurantLayoutController.getSingleRestaurantLayout);
    router.put("/update_restaurantLayout/:id", validateRequest(restaurantLayoutUpdateValidation), restaurantLayoutController.updateRestaurantLayout);
    router.delete("/delete_restaurantLayout/:id", restaurantLayoutController.deleteRestaurantLayout);
    
    export const restaurantLayoutRoutes = router;