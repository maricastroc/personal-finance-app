import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { getServerSession } from "next-auth";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const userId = session?.user?.id?.toString();

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const { budgetId } = req.query;

      if (!budgetId) {
        return res.status(400).json({ message: "Budget ID is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: { accountId: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const budget = await prisma.budget.findUnique({
        where: { id: String(budgetId) },
        include: {
          category: true,
          theme: true,
        },
      });

      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: "expense",
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 3,
      });

      const totalSpentInCategory = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      const percentageSpent = (totalSpentInCategory / budget.amount) * 100;

      const budgetWithDetails = {
        budget,
        amountSpent: totalSpentInCategory,
        percentageSpent: percentageSpent.toFixed(2),
        transactions,
      };

      return res.json({ budget: budgetWithDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "PUT") {
    try {
      const { budgetId } = req.query;

      const { categoryName, themeId, amount } = req.body;

      if (!budgetId || !categoryName || !themeId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const category = await prisma.category.findUnique({
        where: { name: capitalizeFirstLetter(categoryName) },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
      });

      if (!theme) {
        return res.status(400).json({ message: "Theme not found" });
      }

      const updatedBudget = await prisma.budget.update({
        where: { id: String(budgetId) },
        data: {
          categoryId: category.id,
          themeId: theme.id,
          amount,
        },
        include: {
          category: true,
          theme: true,
        },
      });

      return res.status(200).json({
        budget: updatedBudget,
        message: "Budget updated successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { budgetId } = req.query;

      if (!budgetId) {
        return res.status(400).json({ message: "Budget ID is required" });
      }

      const budget = await prisma.budget.findUnique({
        where: { id: String(budgetId) },
      });

      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      if (budget.userId !== userId) {
        return res.status(403).json({
          message: "Forbidden: You are not allowed to delete this budget",
        });
      }

      await prisma.budget.delete({
        where: { id: String(budgetId) },
      });

      return res.status(200).json({ message: "Budget deleted successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
