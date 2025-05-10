
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import { orderController } from "./order.controller";
    import { orderPostValidation,orderUpdateValidation } from "./order.validation";

    const router = express.Router();
    
    router.post("/post_order", validateRequest(orderPostValidation), orderController.postOrder);
    router.get("/get_all_order", orderController.getAllOrder);
    router.get("/get_single_order/:id", orderController.getSingleOrder);
    router.put("/update_order/:id", validateRequest(orderUpdateValidation), orderController.updateOrder);
    router.delete("/delete_order/:id", orderController.deleteOrder);
    
    export const orderRoutes = router;