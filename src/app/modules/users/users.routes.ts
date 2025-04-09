import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { usersController } from "./users.controller";
import { usersUpdateValidation } from "./users.validation";

const router = express.Router();

router.post("/registration", usersController.create);
router.post("/admin-registration", usersController.adminRegistration);
router.post("/admin-login", usersController.adminLogin);
router.post("/login", usersController.login);
router.get("/get_all_customer", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id", validateRequest(usersUpdateValidation), usersController.update);
router.delete("/soft_delete/:id", usersController.delete);
router.delete("/bulk", usersController.bulkDelete);

export const usersRoutes = router;