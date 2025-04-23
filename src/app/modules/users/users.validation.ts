import { z } from 'zod';
    
    export const usersPostValidation = z.object({
     name: z.string().optional(),
     email: z.string().email(),
      image: z.string().optional(),
     password: z.string().min(6),
     phone: z.string().optional(),
      address: z.string().optional(),
      role: z.enum(['admin', 'vendor', 'customer']).default('customer'),
      isDelete: z.boolean().optional(),
    });
    
    
    export const usersUpdateValidation = usersPostValidation.partial();
    