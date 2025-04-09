"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_routes_1 = require("../modules/categories/categories.routes");
const attributeOption_routes_1 = require("../modules/attributeOption/attributeOption.routes");
const attribute_routes_1 = require("../modules/attribute/attribute.routes");
const brand_routes_1 = require("../modules/brand/brand.routes");
const unit_routes_1 = require("../modules/unit/unit.routes");
const product_routes_1 = require("../modules/product/product.routes");
const wishlist_routes_1 = require("../modules/wishlist/wishlist.routes");
const users_routes_1 = require("../modules/users/users.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const order_routes_1 = require("../modules/order/order.routes");
const reports_routes_1 = require("../modules/reports/reports.routes");
const carousel_routes_1 = require("../modules/carousel/carousel.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_routes_1.usersRoutes,
    },
    {
        path: "/coupon",
        route: coupon_routes_1.couponRoutes,
    },
    {
        path: "/report",
        route: reports_routes_1.reportsRoutes,
    },
    {
        path: "/carousel",
        route: carousel_routes_1.carouselRoutes,
    },
    {
        path: "/category",
        route: categories_routes_1.categoryRoutes,
    },
    {
        path: "/orders",
        route: order_routes_1.orderRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.productRoutes,
    },
    {
        path: "/cart",
        route: cart_routes_1.cartRoutes,
    },
    {
        path: "/wishlist",
        route: wishlist_routes_1.wishlistRoutes,
    },
    {
        path: "/unit",
        route: unit_routes_1.unitRoutes,
    },
    {
        path: "/brand",
        route: brand_routes_1.brandRoutes,
    },
    {
        path: "/attributeOption",
        route: attributeOption_routes_1.attributeOptionRoutes,
    },
    {
        path: "/attribute",
        route: attribute_routes_1.attributeRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
