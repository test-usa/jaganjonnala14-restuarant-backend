import { z } from 'zod';
    
    export const brandPostValidation = z.object({
    
      brandName: z.string().min(1, { message: "Brand name is required" }),
      brandImage: z.string().nullable(),
      brandDescription: z.string().optional(),
      isActive: z.boolean().optional(),
      isDelete: z.boolean().optional(),
      
    });
    
    
    export const brandUpdateValidation = brandPostValidation.partial();
    