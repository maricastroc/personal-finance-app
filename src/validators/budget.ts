import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryName: z.string().min(1, "Category is required"),
  themeId: z.string().min(1, "Theme is required"),
  amount: z.number().positive("Amount must be a positive number"),
});

export const updateBudgetSchema = createBudgetSchema;
