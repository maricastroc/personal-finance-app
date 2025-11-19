import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";

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
    // Obtenha o `accountId` do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountId: true },
    });

    if (!user || !user.accountId) {
      return res.status(404).json({ message: "User account not found" });
    }

    const userAccountId = user.accountId;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        category: true,
        sender: true,
        recipient: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    const transactionsWithBalance = transactions.map((transaction) => {
      const balance =
        transaction.senderId === userAccountId ? "expense" : "income";

      return {
        ...transaction,
        balance,
      };
    });

    return res.status(200).json({ transactions: transactionsWithBalance });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
