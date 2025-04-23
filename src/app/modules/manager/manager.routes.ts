
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { managerController } from "./manager.controller";
    import { managerPostValidation,managerUpdateValidation } from "./manager.validation";

    const router = express.Router();
    
    router.post("/post_manager", validateRequest(managerPostValidation), managerController.postManager);
    router.get("/get_all_manager", managerController.getAllManager);
    router.get("/get_single_manager/:id", managerController.getSingleManager);
    router.put("/update_manager/:id", validateRequest(managerUpdateValidation), managerController.updateManager);
    router.delete("/delete_manager/:id", managerController.deleteManager);
    
    export const managerRoutes = router;