"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const users_routes_1 = require("../modules/users/user/users.routes");
const category_routes_1 = require("../modules/category/category.routes");
const menu_routes_1 = require("../modules/menu/menu.routes");
const floor_routes_1 = require("../modules/floor/floor.routes");
const order_routes_1 = require("../modules/order/order.routes");
const table_routes_1 = require("../modules/table/table.routes");
const restaurantZone_routes_1 = require("../modules/restaurantZone/restaurantZone.routes");
const restaurantLayout_routes_1 = require("../modules/restaurantLayout/restaurantLayout.routes");
const restuarant_routes_1 = require("../modules/restuarant/restuarant.routes");
const staff_routes_1 = require("../modules/users/staff/staff.routes");
const analytic_route_1 = require("../modules/analytics/RestaurantAnaltytics/analytic.route");
const adminAnalytics_route_1 = require("../modules/analytics/adminAnalytics/adminAnalytics.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/users",
        route: users_routes_1.usersRoutes,
    },
    {
        path: "/categories",
        route: category_routes_1.categoryRoutes,
    }, {
        path: "/menus",
        route: menu_routes_1.menuRoutes
    }, {
        path: "/floor",
        route: floor_routes_1.floorRoutes
    }, {
        path: "/order",
        route: order_routes_1.orderRoutes
    }, {
        path: "/table",
        route: table_routes_1.tableRoutes
    }, {
        path: "/zone",
        route: restaurantZone_routes_1.restaurantZoneRoutes,
    }, {
        path: "/orders",
        route: order_routes_1.orderRoutes,
    }, {
        path: "/layout",
        route: restaurantLayout_routes_1.restaurantLayoutRoutes,
    }, {
        path: "/restaurant",
        route: restuarant_routes_1.restuarantRoutes,
    }, {
        path: "/staff",
        route: staff_routes_1.staffRoutes,
    }, {
        path: "/analytics",
        route: analytic_route_1.analyticsRoutes
    }, {
        path: "/admin-analytics",
        route: adminAnalytics_route_1.AdminAnalyticsRoutes,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
