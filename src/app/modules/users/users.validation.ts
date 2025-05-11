import { z } from "zod";

export const restaurantSchema = z
  .object({
    name: z.string(),
    businessName: z.string(),
    businessEmail: z.string().email(),
    phone: z.string(),
    gstRate: z.string(),
    cgstRate: z.string(),
    sgstRate: z.string(),
    address: z.string(),
    logo: z.string().url(),
    tagline: z.string(),
    coverPhoto: z.array(z.string().url()),
    description: z.string(),
    referralCode: z.string(),
  })
  .nullable();

export const staffSchema = z
  .object({
    workDays: z.string(),
    workTime: z.string(),
  })
  .nullable();

export const userInputSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    fullName: z.string(),
    nickName: z.string(),
    gender: z.enum(["male", "female"]),
    country: z.string(),
    language: z.string(),
    timeZone: z.string(),
    phone: z.string(),
    password: z.string().min(6),
    image: z.string().url().optional(),
    address: z.string().optional(),
    role: z
      .enum([
        "admin",
        "restaurant_owner",
        "staff",
        "customer",
        "manager",
        "dine in",
        "waiter",
        "chief",
        "cashier",
        "maintenance",
      ])
      .optional(),
  }),
  restaurant: restaurantSchema,
  staff: staffSchema,
  status: z.enum(["active", "inactive", "pending"]),
});

export const usersUpdateValidation = userInputSchema.partial();
