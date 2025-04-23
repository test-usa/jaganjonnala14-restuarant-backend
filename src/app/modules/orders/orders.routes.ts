
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { ordersController } from "./orders.controller";
    import { ordersPostValidation,ordersUpdateValidation } from "./orders.validation";

    const router = express.Router();
    
    router.post("/post_orders", validateRequest(ordersPostValidation), ordersController.postOrders);
    router.get("/get_all_orders", ordersController.getAllOrders);
    router.get("/get_single_orders/:id", ordersController.getSingleOrders);
    router.put("/update_orders/:id", validateRequest(ordersUpdateValidation), ordersController.updateOrders);
    router.delete("/delete_orders/:id", ordersController.deleteOrders);
    
    export const ordersRoutes = router;