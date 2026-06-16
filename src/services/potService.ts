import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/apiHandler";
import { formatToDollar } from "@/utils/formatToDollar";
import { z } from "zod";
import { createPotSchema, updatePotSchema } from "@/validators/pot";

export async function listPots(userId: string) {
  const pots = await prisma.pot.findMany({
    where: { userId },
    include: { theme: true },
    orderBy: [{ createdAt: "desc" }],
  });

  const totalCurrentAmount = pots.reduce((sum, p) => sum + p.currentAmount, 0);

  return { pots, totalCurrentAmount };
}

export async function getPot(userId: string, potId: string) {
  const pot = await prisma.pot.findUnique({
    where: { id: potId },
    include: { theme: true },
  });

  if (!pot) throw new ApiError(404, "Pot not found");

  return {
    pot,
    percentageSpent: ((pot.currentAmount / pot.targetAmount) * 100).toFixed(2),
  };
}

export async function createPot(
  userId: string,
  body: z.infer<typeof createPotSchema>
) {
  const { name, themeId, targetAmount, initialAmount = 0 } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  if (initialAmount > (user.currentBalance ?? 0)) {
    throw new ApiError(
      400,
      "Insufficient funds. You cannot add more than your available balance."
    );
  }

  const theme = await prisma.theme.findUnique({ where: { id: themeId } });
  if (!theme) throw new ApiError(400, "Theme not found");

  if (initialAmount > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { decrement: initialAmount } },
    });
  }

  return prisma.pot.create({
    data: { userId, name, themeId: theme.id, targetAmount, currentAmount: initialAmount },
    include: { theme: true },
  });
}

export async function updatePot(
  userId: string,
  potId: string,
  body: z.infer<typeof updatePotSchema>
) {
  const { name, themeId, targetAmount, currentAmount } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const existingPot = await prisma.pot.findUnique({ where: { id: potId } });
  if (!existingPot) throw new ApiError(404, "Pot not found");

  const amountChange = currentAmount - existingPot.currentAmount;

  if (amountChange > 0) {
    if (currentAmount > targetAmount) {
      throw new ApiError(
        400,
        `Cannot add money. This would exceed the target amount by ${formatToDollar(currentAmount - targetAmount)}.`
      );
    }

    if (amountChange > (user.currentBalance ?? 0)) {
      throw new ApiError(
        400,
        "Insufficient funds. You cannot add more than your available balance."
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { decrement: amountChange } },
    });
  }

  if (amountChange < 0) {
    const withdrawal = Math.abs(amountChange);

    if (withdrawal > existingPot.currentAmount) {
      throw new ApiError(
        400,
        "Insufficient pot funds. You cannot withdraw more than the available pot balance."
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { increment: withdrawal } },
    });
  }

  const theme = await prisma.theme.findUnique({ where: { id: themeId } });
  if (!theme) throw new ApiError(404, "Theme not found");

  const updatedPot = await prisma.pot.update({
    where: { id: potId },
    data: { themeId: theme.id, targetAmount, currentAmount, name },
    include: { theme: true },
  });

  const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

  return {
    pot: updatedPot,
    user: { currentBalance: updatedUser?.currentBalance ?? 0 },
  };
}

export async function deletePot(userId: string, potId: string) {
  const pot = await prisma.pot.findUnique({ where: { id: potId } });
  if (!pot) throw new ApiError(404, "Pot not found");
  if (pot.userId !== userId) throw new ApiError(403, "Forbidden");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  if (pot.currentAmount > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { increment: pot.currentAmount } },
    });
  }

  await prisma.pot.delete({ where: { id: potId } });

  return { returnedAmount: pot.currentAmount };
}
