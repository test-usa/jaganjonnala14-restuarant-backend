import { z } from 'zod';

export const productValidation = z.object({
  productName: z.string().min(1, "Product name is required"),
  skuCode: z.string().min(1, "SKU code is required"),
  productCategory: z.string().min(1, "Category is required"),
  productBrand: z.string().min(1, "Brand is required"),
  productWeight: z.string().nullable().optional(),
  productVariants: z.string().min(1, "Unit is required"),
  productPurchasePoint: z.string().nullable().optional(),
  productBuyingPrice: z.number().min(0, "Buying price must be a positive number"),
  productSellingPrice: z.number().min(0, "Selling price must be a positive number"),
  productOfferPrice: z.number().nullable().optional(),
  productStock: z.number().min(0, "Stock must be a positive number"),
  isFeatured: z.boolean().default(false),
  haveVarient: z.boolean().default(false),
  productDescription: z.string().nullable().optional(),
  productFeatureImage: z.string().nullable().optional(),
  productImages: z.array(z.string()).nullable().optional(),
  variant: z.string().nullable().optional(),
  variantcolor: z.array(z.string()).nullable().optional(),
});

// ✅ Ensure null values are allowed in updates
export const productUpdateValidation = productValidation.deepPartial();
