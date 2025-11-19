import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

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

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { accountId: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountId = user.accountId;

    const budgets = await prisma.budget.findMany({
      where: { userId: String(userId) },
      include: {
        category: true,
        theme: true,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        senderId: accountId,
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
        categoryName: budget.category.name,
        amountSpent: totalSpentInCategory,
        budgetLimit: budget.amount,
        theme: budget.theme?.color,
      };
    });

    return res.json({ budgets: budgetsWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
