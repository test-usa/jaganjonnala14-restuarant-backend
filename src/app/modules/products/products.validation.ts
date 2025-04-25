import { z } from 'zod';
import mongoose from 'mongoose';

// Helper for ObjectId validation
const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const productsPostValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().optional(),
  description: z.string().optional(),

  brand: objectId.optional(),
  category: objectId,
  subcategories: z
    .union([objectId, z.array(objectId)])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),


  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).optional(),
  stock: z.coerce.number().min(0).optional(),
  sku: z.string().min(1, { message: "SKU is required" }),

  images: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),

  thumbnail: z.string().nullable().optional(),
  video: z.string().nullable().optional(),

  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),

  variant: z
    .union([objectId, z.array(objectId)])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),

  shipping: z
    .object({
      weight: z.coerce.number().optional(),
      dimensions: z
        .object({
          length: z.coerce.number().optional(),
          width: z.coerce.number().optional(),
          height: z.coerce.number().optional(),
        })
        .optional(),
    })
    .optional(),

  warranty: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  isDelete: z.coerce.boolean().optional(),
});

export const productsUpdateValidation = productsPostValidation.partial();
