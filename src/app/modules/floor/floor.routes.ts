
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { floorController } from "./floor.controller";
    import { floorPostValidation,floorUpdateValidation } from "./floor.validation";

    const router = express.Router();
    
    router.post("/post_floor", validateRequest(floorPostValidation), floorController.postFloor);
    router.get("/get_all_floor", floorController.getAllFloor);
    router.get("/get_single_floor/:id", floorController.getSingleFloor);
    router.put("/update_floor/:id", validateRequest(floorUpdateValidation), floorController.updateFloor);
    router.delete("/delete_floor/:id", floorController.deleteFloor);
    
    export const floorRoutes = router;