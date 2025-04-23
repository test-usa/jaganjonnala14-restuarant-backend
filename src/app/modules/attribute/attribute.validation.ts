import { z } from 'zod';
    
    export const attributePostValidation = z.object({
      //
      name: z.string().min(1, { message: "Attribute name is required" }),
      description: z.string().optional(),
      slug: z.string().optional(),
      attributeOption: z.string().array().optional(),
      isActive: z.boolean().optional(),
      isDelete: z.boolean().optional(),
    });
    
    
    export const attributeUpdateValidation = attributePostValidation.partial();
    