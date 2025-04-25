
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { employeeController } from "./employee.controller";
    import { employeePostValidation,employeeUpdateValidation } from "./employee.validation";

    const router = express.Router();
    
    router.post("/post_employee", validateRequest(employeePostValidation), employeeController.postEmployee);
    router.get("/get_all_employee", employeeController.getAllEmployee);
    router.get("/get_single_employee/:id", employeeController.getSingleEmployee);
    router.put("/update_employee/:id", validateRequest(employeeUpdateValidation), employeeController.updateEmployee);
    router.delete("/delete_employee/:id", employeeController.deleteEmployee);
    
    export const employeeRoutes = router;