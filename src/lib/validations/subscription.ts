// lib/validations/subscription.ts
import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  cost: z.coerce.number().positive({ message: 'Cost must be a positive number' }), // z.coerce.number() will try to convert string to number
  currency: z.string().min(1, { message: 'Currency is required' }),
  billingCycle: z.string().min(1, { message: 'Billing cycle is required' }),
  lastBillingDate: z.coerce.date({ errorMap: () => ({ message: 'Valid last billing date is required' }) }),
  status: z.string().min(1, { message: 'Status is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  folder: z.string().min(1, { message: 'Folder is required' }),
  notes: z.string().optional()
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;