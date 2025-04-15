import { z } from 'zod';

export const productValidation = z.object({
  productName: z.string().min(1, "Product name is required"),
  skuCode: z.string().min(1, "SKU Code is required"),
  productCategory: z.string().min(1, "Product category is required"), // ObjectId as string
  productBrand: z.string().min(1, "Product brand is required"),      // ObjectId as string

  productVariants: z.array(z.string()).optional(), // ObjectId[] as string[]

  productBuyingPrice: z.number().min(0, "Buying price must be ≥ 0"),
  productSellingPrice: z.number().min(0, "Selling price must be ≥ 0"),
  productOfferPrice: z.number().min(0, "Offer price must be ≥ 0").optional(),

  productStock: z.number().min(0, "Stock must be ≥ 0"),
  salesCount: z.number().min(0).optional(),

  isFeatured: z.boolean().optional(),
  productDescription: z.string().optional(),
  productFeatureImage: z.string().nullable().optional(),
  productImages: z.array(z.string()).optional(),

  isDelete: z.boolean().optional(),
});

// ✅ Ensure null values are allowed in updates
export const productUpdateValidation = productValidation.partial();
