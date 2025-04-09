import { z } from 'zod';

export const wishlistValidation = z.object({
  products: z.array(z.string().min(1, "Product ID is required")),
});


export const wishlistUpdateValidation = wishlistValidation.partial();
