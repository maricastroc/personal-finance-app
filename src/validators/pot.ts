import { z } from "zod";

export const createPotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  themeId: z.string().min(1, "Theme is required"),
  targetAmount: z.number().positive("Target amount must be a positive number"),
  initialAmount: z.number().min(0).optional(),
});

export const updatePotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  themeId: z.string().min(1, "Theme is required"),
  targetAmount: z.number().positive("Target amount must be a positive number"),
  currentAmount: z.number().min(0, "Current amount must be zero or positive"),
});
