import { z } from 'zod';
    
    export const authRegisterValidation = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
      address: z.string().optional(),
      role: z.enum(['vendor', 'customer']).default('customer'),
       
    });
    export const authLoginValidation = z.object({
      email: z.string().email(),
      password: z.string().min(6),
       
    });
    
    
    