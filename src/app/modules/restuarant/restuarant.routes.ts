
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { restuarantController } from "./restuarant.controller";
    import { restuarantPostValidation,restuarantUpdateValidation } from "./restuarant.validation";

    const router = express.Router();
    
    router.post("/post_restuarant", validateRequest(restuarantPostValidation), restuarantController.postRestuarant);
    router.get("/get_all_restuarant", restuarantController.getAllRestuarant);
    router.get("/get_single_restuarant/:id", restuarantController.getSingleRestuarant);
    router.put("/update_restuarant/:id", validateRequest(restuarantUpdateValidation), restuarantController.updateRestuarant);
    router.delete("/delete_restuarant/:id", restuarantController.deleteRestuarant);
    
    export const restuarantRoutes = router;