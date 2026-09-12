import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1, "Privy App ID is required"),
  PRIVY_APP_SECRET: z.string().min(1, "Privy App Secret is required"),
  BAKERY_PRIVATE_KEY: z.string().startsWith('0x', "Must be a valid hex string starting with 0x"),
  BAKERY_PUBLIC_ADDRESS: z.string().optional(),
  AUTHORIZED_STAFF_EMAIL: z.string().email("Must be a valid staff email address"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
  BAKERY_PRIVATE_KEY: process.env.BAKERY_PRIVATE_KEY,
  BAKERY_PUBLIC_ADDRESS: process.env.NEXT_PUBLIC_BAKERY_PUBLIC_ADDRESS || process.env.BAKERY_PUBLIC_ADDRESS,
  AUTHORIZED_STAFF_EMAIL: process.env.AUTHORIZED_STAFF_EMAIL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
