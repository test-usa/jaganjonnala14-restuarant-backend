
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restaurantTableSettingController } from "./restaurantTableSetting.controller";
    import { restaurantTableSettingPostValidation,restaurantTableSettingUpdateValidation } from "./restaurantTableSetting.validation";

    const router = express.Router();
    
    router.post("/post_restaurantTableSetting", validateRequest(restaurantTableSettingPostValidation), restaurantTableSettingController.postRestaurantTableSetting);
    router.get("/get_all_restaurantTableSetting", restaurantTableSettingController.getAllRestaurantTableSetting);
    router.get("/get_single_restaurantTableSetting/:id", restaurantTableSettingController.getSingleRestaurantTableSetting);
    router.put("/update_restaurantTableSetting/:id", validateRequest(restaurantTableSettingUpdateValidation), restaurantTableSettingController.updateRestaurantTableSetting);
    router.delete("/delete_restaurantTableSetting/:id", restaurantTableSettingController.deleteRestaurantTableSetting);
    
    export const restaurantTableSettingRoutes = router;