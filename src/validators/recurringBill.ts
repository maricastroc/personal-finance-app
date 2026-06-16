import { z } from "zod";

export const updateRecurringBillSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export const payRecurringBillSchema = z.object({
  paymentDate: z.string().optional(),
});
