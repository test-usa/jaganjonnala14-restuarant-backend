
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { tableController } from "./table.controller";
    import { tablePostValidation,tableUpdateValidation } from "./table.validation";

    const router = express.Router();
    
    router.post("/post_table", validateRequest(tablePostValidation), tableController.postTable);
    router.get("/get_all_table", tableController.getAllTable);
    router.get("/get_single_table/:id", tableController.getSingleTable);
    router.put("/update_table/:id", validateRequest(tableUpdateValidation), tableController.updateTable);
    router.delete("/delete_table/:id", tableController.deleteTable);
    
    export const tableRoutes = router;