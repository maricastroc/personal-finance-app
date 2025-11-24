import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { getServerSession } from "next-auth";
import { formatToDollar } from "@/utils/formatToDollar";

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
      const { potId } = req.query;

      if (!potId) {
        return res.status(400).json({ message: "Pot ID is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: { accountId: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pot = await prisma.pot.findUnique({
        where: { id: String(potId) },
        include: {
          theme: true,
        },
      });

      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      const percentageSpent = (pot.currentAmount / pot.targetAmount) * 100;

      const potWithDetails = {
        pot,
        percentageSpent: percentageSpent.toFixed(2),
      };

      return res.json({ potWithDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "PUT") {
    try {
      const { potId } = req.query;
      const { name, themeId, targetAmount, currentAmount } = req.body;

      if (!potId || !name || !themeId || !targetAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingPot = await prisma.pot.findUnique({
        where: { id: String(potId) },
      });

      if (!existingPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      const amountChange = currentAmount - existingPot.currentAmount;

      if (amountChange > 0) {
        if (currentAmount > targetAmount) {
          const exceededBy = currentAmount - targetAmount;

          return res.status(400).json({
            message: `Cannot add money. This would exceed the target amount by ${formatToDollar(
              exceededBy
            )}.`,
          });
        }

        if (amountChange > (user?.currentBalance || 0)) {
          return res.status(400).json({
            message:
              "Insufficient funds. You cannot add more than your available balance.",
          });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              decrement: amountChange,
            },
          },
        });
      }

      if (amountChange < 0) {
        const withdrawalAmount = Math.abs(amountChange);

        if (withdrawalAmount > existingPot.currentAmount) {
          return res.status(400).json({
            message:
              "Insufficient pot funds. You cannot withdraw more than the available pot balance.",
          });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              increment: withdrawalAmount,
            },
          },
        });
      }

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
      });

      if (!theme) {
        return res.status(404).json({ message: "Theme not found" });
      }

      const updatedPot = await prisma.pot.update({
        where: { id: String(potId) },
        data: {
          themeId: theme.id,
          targetAmount,
          currentAmount: currentAmount || 0,
          name,
        },
        include: {
          theme: true,
        },
      });

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      return res.status(200).json({
        pot: updatedPot,
        user: { currentBalance: updatedUser?.currentBalance || 0 },
        message: "Pot successfully updated!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { potId } = req.query;

      if (!potId) {
        return res.status(400).json({ message: "Pot ID is required" });
      }

      const pot = await prisma.pot.findUnique({
        where: { id: String(potId) },
      });

      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      if (pot.userId !== userId) {
        return res.status(403).json({
          message: "Forbidden: You are not allowed to delete this pot",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (pot.currentAmount > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              increment: pot.currentAmount,
            },
          },
        });
      }

      await prisma.pot.delete({
        where: { id: String(potId) },
      });

      return res.status(200).json({
        message: "Pot successfully deleted!",
        returnedAmount: pot.currentAmount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
