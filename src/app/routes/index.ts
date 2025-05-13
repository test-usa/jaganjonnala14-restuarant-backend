import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { usersRoutes } from "../modules/users/user/users.routes";


const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: usersRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
