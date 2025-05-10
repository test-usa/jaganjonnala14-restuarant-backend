
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { menuController } from "./menu.controller";
    import { menuPostValidation,menuUpdateValidation } from "./menu.validation";

    const router = express.Router();
    
    router.post("/post_menu", validateRequest(menuPostValidation), menuController.postMenu);
    router.get("/get_all_menu", menuController.getAllMenu);
    router.get("/get_single_menu/:id", menuController.getSingleMenu);
    router.put("/update_menu/:id", validateRequest(menuUpdateValidation), menuController.updateMenu);
    router.delete("/delete_menu/:id", menuController.deleteMenu);
    
    export const menuRoutes = router;