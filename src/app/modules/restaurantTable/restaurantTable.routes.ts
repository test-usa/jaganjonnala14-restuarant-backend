
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restaurantTableController } from "./restaurantTable.controller";
    import { restaurantTablePostValidation,restaurantTableUpdateValidation } from "./restaurantTable.validation";

    const router = express.Router();
    
    router.post("/post_restaurantTable", validateRequest(restaurantTablePostValidation), restaurantTableController.postRestaurantTable);
    router.get("/get_all_restaurantTable", restaurantTableController.getAllRestaurantTable);
    router.get("/get_single_restaurantTable/:id", restaurantTableController.getSingleRestaurantTable);
    router.put("/update_restaurantTable/:id", validateRequest(restaurantTableUpdateValidation), restaurantTableController.updateRestaurantTable);
    router.delete("/delete_restaurantTable/:id", restaurantTableController.deleteRestaurantTable);
    
    export const restaurantTableRoutes = router;