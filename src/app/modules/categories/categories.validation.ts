import { z } from 'zod';
    
    export const categoriesPostValidation = z.object({
      name: z.string().min(1, { message: "Category name is required" }),
      slug: z.string().optional(),
      image: z.string().nullable(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
      isDelete: z.boolean().optional(),
      parentCategory: z.string().nullable().optional(),
    });
    
    
    export const categoriesUpdateValidation = categoriesPostValidation.partial();
    