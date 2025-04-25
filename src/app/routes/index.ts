import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { productsRoutes } from "../modules/products/products.routes";
import { categoriesRoutes } from "../modules/categories/categories.routes";
import { ordersRoutes } from "../modules/orders/orders.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { customerRoutes } from "../modules/customer/customer.routes";
import { brandRoutes } from "../modules/brand/brand.routes";
import { attributeOptionRoutes } from "../modules/attributeOption/attributeOption.routes";
import { attributeRoutes } from "../modules/attribute/attribute.routes";
import { employeeRoutes } from "../modules/employee/employee.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/users",
        route: usersRoutes
    },
    {
        path: "/admin",
        route: adminRoutes
    },
    {
        path: "/customers",
        route: customerRoutes
    },
    {
        path: "/employee",
        route: employeeRoutes
    },
    {
        path: "/brand",
        route: brandRoutes
    },
    {
        path: "/atribute",
        route: attributeRoutes
    },
    {
        path: "/atribute_option",
        route: attributeOptionRoutes
    },
    {
        path: "/product",
        route: productsRoutes
    },
    {
        path: "/category",
        route: categoriesRoutes
    },
    {
        path: "/orders",
        route: ordersRoutes
    },
 
]


moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
