
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { categoryController } from "./category.controller";
    import { categoryPostValidation,categoryUpdateValidation } from "./category.validation";

    const router = express.Router();
    
    router.post("/post_category", validateRequest(categoryPostValidation), categoryController.postCategory);
    router.get("/get_all_category", categoryController.getAllCategory);
    router.get("/get_single_category/:id", categoryController.getSingleCategory);
    router.put("/update_category/:id", validateRequest(categoryUpdateValidation), categoryController.updateCategory);
    router.delete("/delete_category/:id", categoryController.deleteCategory);
    
    export const categoryRoutes = router;