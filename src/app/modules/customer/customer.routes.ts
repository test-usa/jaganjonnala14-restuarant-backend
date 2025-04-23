
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { customerController } from "./customer.controller";
    import { customerPostValidation,customerUpdateValidation } from "./customer.validation";

    const router = express.Router();
    
    router.post("/post_customer", validateRequest(customerPostValidation), customerController.postCustomer);
    router.get("/get_all_customer", customerController.getAllCustomer);
    router.get("/get_single_customer/:id", customerController.getSingleCustomer);
    router.put("/update_customer/:id", validateRequest(customerUpdateValidation), customerController.updateCustomer);
    router.delete("/delete_customer/:id", customerController.deleteCustomer);
    
    export const customerRoutes = router;