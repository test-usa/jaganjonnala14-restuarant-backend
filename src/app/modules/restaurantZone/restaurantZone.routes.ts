
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restaurantZoneTypeController } from "./restaurantZone.controller";
    import { restaurantZoneTypePostValidation,restaurantZoneTypeUpdateValidation } from "./restaurantZone.validation";

    const router = express.Router();
    
    router.post("/post_restaurantZoneType", validateRequest(restaurantZoneTypePostValidation), restaurantZoneTypeController.postRestaurantZoneType);
    router.get("/get_all_restaurantZoneType", restaurantZoneTypeController.getAllRestaurantZoneType);
    router.get("/get_single_restaurantZoneType/:id", restaurantZoneTypeController.getSingleRestaurantZoneType);
    router.put("/update_restaurantZoneType/:id", validateRequest(restaurantZoneTypeUpdateValidation), restaurantZoneTypeController.updateRestaurantZoneType);
    router.delete("/delete_restaurantZoneType/:id", restaurantZoneTypeController.deleteRestaurantZoneType);
    
    export const restaurantZoneTypeRoutes = router;