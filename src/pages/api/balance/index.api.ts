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
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        contactName: true,
        contactAvatar: true,
        date: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    let expenses = 0;
    let incomes = 0;
    let transfers = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        expenses += transaction.amount;
      } else if (transaction.type === "income") {
        incomes += transaction.amount;
      } else if (transaction.type === "transfer") {
        transfers += transaction.amount;
      }
    });

    const currentBalance = (user?.initialBalance || 0) + incomes - expenses;

    return res.json({
      currentBalance,
      expenses,
      incomes,
      transfers,
      transactions,
      initialBalance: user?.initialBalance || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
