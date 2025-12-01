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
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session?.user?.id?.toString();

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: { accountId: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const budgets = await prisma.budget.findMany({
        where: { userId: String(userId) },
        include: {
          category: true,
          theme: true,
        },
      });

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
        },
        include: {
          category: true,
        },
      });

      const budgetsWithDetails = budgets.map((budget) => {
        const totalSpentInCategory = transactions
          .filter((transaction) => transaction.categoryId === budget.categoryId)
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
          id: budget.id,
          category: budget.category,
          amountSpent: totalSpentInCategory,
          amount: budget.amount,
          theme: budget.theme,
        };
      });

      return res.json({ budgets: budgetsWithDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "POST") {
    try {
      const { categoryName, themeId, amount } = req.body;

      if (!categoryName || !themeId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let category = await prisma.category.findUnique({
        where: { name: capitalizeFirstLetter(categoryName) },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName },
        });
      }

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
      });

      if (!theme) {
        return res.status(400).json({ message: "Theme not found" });
      }

      const newBudget = await prisma.budget.create({
        data: {
          userId,
          categoryId: category.id,
          themeId: theme.id,
          amount,
        },
        include: {
          category: true,
          theme: true,
        },
      });

      return res.status(201).json({
        budget: newBudget,
        message: "Budget created successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
