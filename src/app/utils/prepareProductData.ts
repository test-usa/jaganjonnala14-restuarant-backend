/* eslint-disable @typescript-eslint/no-explicit-any */
// middlewares/prepareProductData.ts

import { Request, Response, NextFunction } from "express";

export const prepareProductData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: any = {
      ...req.body,

      // Type conversions and defaults
      productBuyingPrice: Number(req.body.productBuyingPrice) || 0,
      productSellingPrice: Number(req.body.productSellingPrice) || 0,
      productOfferPrice: Number(req.body.productOfferPrice) || 0,
      productStock: Number(req.body.productStock) || 0,
      isFeatured: req.body.isFeatured === "true" ? true : false,

      productVariants:
        req.body.productVariants && req.body.productVariants.length > 0
          ? JSON.parse(req.body.productVariants)
          : [],

      // Handle uploaded images
      productFeatureImage:
        req.files && (req.files as any).productFeatureImage
          ? (req.files as any).productFeatureImage[0].path
          : null,

      productImages:
        req.files && (req.files as any).productImages
          ? (req.files as any).productImages.map((f: any) => f.path)
          : [],
    };

    req.body = body;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong in data preparation.";
    res.status(400).json({ error: errorMessage });
  }
};
