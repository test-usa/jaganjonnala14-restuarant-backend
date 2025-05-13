import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { usersRoutes } from "../modules/users/user/users.routes";


import { adminRoutes } from "../modules/admin/admin.routes";
import { categoryRoutes } from "../modules/category/category.routes";


const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: usersRoutes,

  },
  {
    path: "/admin",
    route: adminRoutes,
  },{
    path: "/categories",
    route: categoryRoutes,

  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
