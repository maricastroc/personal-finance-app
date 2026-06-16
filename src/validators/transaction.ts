import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.number().refine((v) => v !== 0, "Amount must not be zero"),
  categoryName: z.string().min(1, "Category is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactAvatar: z.string().optional(),
  type: z.enum(["income", "expense", "transfer"], {
    errorMap: () => ({ message: "Invalid transaction type" }),
  }),
  isRecurring: z.boolean().optional(),
  recurrenceDay: z.number().optional(),
  recurrenceFrequency: z.string().optional(),
  date: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.number().refine((v) => v !== 0, "Amount must not be zero"),
  categoryName: z.string().min(1, "Category is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactAvatar: z.string().optional(),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Invalid transaction type" }),
  }),
  date: z.string().optional(),
});
