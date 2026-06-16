import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/apiHandler";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { z } from "zod";
import { createBudgetSchema, updateBudgetSchema } from "@/validators/budget";

export async function listBudgets(userId: string) {
  const [budgets, transactions] = await Promise.all([
    prisma.budget.findMany({
      where: { userId },
      include: { category: true, theme: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    }),
  ]);

  return budgets.map((budget) => {
    const amountSpent = transactions
      .filter((t) => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      id: budget.id,
      category: budget.category,
      amountSpent,
      amount: budget.amount,
      theme: budget.theme,
    };
  });
}

export async function getBudget(userId: string, budgetId: string) {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: { category: true, theme: true },
  });

  if (!budget) throw new ApiError(404, "Budget not found");

  const transactions = await prisma.transaction.findMany({
    where: { userId, categoryId: budget.categoryId, type: "expense" },
    include: { category: true },
    orderBy: { date: "desc" },
    take: 3,
  });

  const amountSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    budget,
    amountSpent,
    percentageSpent: ((amountSpent / budget.amount) * 100).toFixed(2),
    transactions,
  };
}

export async function createBudget(
  userId: string,
  body: z.infer<typeof createBudgetSchema>
) {
  const { categoryName, themeId, amount } = body;

  let category = await prisma.category.findUnique({
    where: { name: capitalizeFirstLetter(categoryName) },
  });

  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } });
  }

  const theme = await prisma.theme.findUnique({ where: { id: themeId } });
  if (!theme) throw new ApiError(400, "Theme not found");

  return prisma.budget.create({
    data: { userId, categoryId: category.id, themeId: theme.id, amount },
    include: { category: true, theme: true },
  });
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  body: z.infer<typeof updateBudgetSchema>
) {
  const { categoryName, themeId, amount } = body;

  const category = await prisma.category.findUnique({
    where: { name: capitalizeFirstLetter(categoryName) },
  });
  if (!category) throw new ApiError(404, "Category not found");

  const theme = await prisma.theme.findUnique({ where: { id: themeId } });
  if (!theme) throw new ApiError(400, "Theme not found");

  return prisma.budget.update({
    where: { id: budgetId },
    data: { categoryId: category.id, themeId: theme.id, amount },
    include: { category: true, theme: true },
  });
}

export async function deleteBudget(userId: string, budgetId: string) {
  const budget = await prisma.budget.findUnique({ where: { id: budgetId } });
  if (!budget) throw new ApiError(404, "Budget not found");
  if (budget.userId !== userId) throw new ApiError(403, "Forbidden");

  await prisma.budget.delete({ where: { id: budgetId } });
}
