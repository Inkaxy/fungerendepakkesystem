
import * as z from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  customer_number: z.string().optional(),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Ugyldig e-postadresse').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.string(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
