import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { getServerSession } from "next-auth";

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
      const pots = await prisma.pot.findMany({
        where: { userId },
        include: { theme: true },
      });

      const totalCurrentAmount = pots.reduce(
        (sum, pot) => sum + pot.currentAmount,
        0
      );

      return res.status(200).json({
        data: {
          pots,
          totalCurrentAmount,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, themeId, targetAmount, initialAmount = 0 } = req.body;

      if (!name || !themeId || !targetAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (initialAmount > (user.currentBalance ?? 0)) {
        return res.status(400).json({
          message:
            "Insufficient funds. You cannot add more than your available balance.",
        });
      }

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
      });

      if (!theme) {
        return res.status(400).json({ message: "Theme not found" });
      }

      if (initialAmount > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              decrement: initialAmount,
            },
          },
        });
      }

      const newPot = await prisma.pot.create({
        data: {
          userId,
          name,
          themeId: theme.id,
          targetAmount,
          currentAmount: initialAmount,
        },
        include: { theme: true },
      });

      return res.status(200).json({
        pot: newPot,
        message: "Pot successfully created!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
