import { Router } from "express";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { brandRoutes } from "../modules/brand/brand.routes";
import { variantsRoutes } from "../modules/variants/variants.routes";
import { productRoutes } from "../modules/product/product.routes";
import { wishlistRoutes } from "../modules/wishlist/wishlist.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { cartRoutes } from "../modules/cart/cart.routes";
import { couponRoutes } from "../modules/coupon/coupon.routes";
import { orderRoutes } from "../modules/order/order.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";
import { carouselRoutes } from "../modules/carousel/carousel.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: usersRoutes,
  },
  {
    path: "/coupon",
    route: couponRoutes,
  },
  {
    path: "/report",
    route: reportsRoutes,
  },
  {
    path: "/carousel",
    route: carouselRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/wishlist",
    route: wishlistRoutes,
  },

  {
    path: "/variants",
    route: variantsRoutes,
  },
  {
    path: "/brand",
    route: brandRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
