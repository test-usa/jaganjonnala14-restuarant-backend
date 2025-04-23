import { z } from 'zod';
    
    export const vendorsPostValidation = z.object({
      
      name: z.string(),
      email: z.string(),
      password : z.string(),
      phone: z.string(),
      address: z.string(),
      shopName: z.string(),
      shopEmail: z.string().email().optional(),
      shopPhone: z.string().optional(),
      shopAddress: z.string().optional(),
      description: z.string().optional(),
      logo: z.string().optional(),
      
   
    });
    
    
    export const vendorsUpdateValidation = vendorsPostValidation.partial();
    