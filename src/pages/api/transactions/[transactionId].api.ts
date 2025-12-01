/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";

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

  if (req.method === "PUT") {
    const { transactionId } = req.query;

    const {
      description,
      amount,
      categoryName,
      contactName,
      contactAvatar,
      type,
      date,
    } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    if (!categoryName || !amount || !contactName || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: String(transactionId),
        userId: userId,
      },
      include: {
        recurringBill: true,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (
      existingTransaction.recurringBillId ||
      existingTransaction.isRecurringGenerated
    ) {
      return res.status(400).json({
        message:
          "Cannot edit transactions created via 'Pay Now'. These payments are linked to recurring bills.",
      });
    }

    if (existingTransaction.isRecurring) {
      return res.status(400).json({
        message:
          "Cannot edit transactions created via 'Pay Now'. These payments are linked to recurring bills.",
      });
    }

    if (type === "expense") {
      const amountDifference = Math.abs(amount) - existingTransaction.amount;

      if (amountDifference > 0) {
        if (amountDifference > (user?.currentBalance || 0)) {
          return res.status(400).json({
            message:
              "Insufficient funds. You don't have enough balance to cover this expense.",
          });
        }
      }
    }

    if (date) {
      const newDate = new Date(date);
      const originalDate = new Date(existingTransaction.date);

      if (newDate < originalDate) {
        return res.status(400).json({
          message:
            "Cannot change transaction date to a date earlier than the original transaction date.",
        });
      }
    }

    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName },
      });
    }

    const categoryId = category.id;

    try {
      if (type === "expense") {
        const amountDifference = Math.abs(amount) - existingTransaction.amount;

        if (amountDifference !== 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              currentBalance: {
                decrement: amountDifference,
              },
            },
          });
        }
      } else if (type === "income") {
        const amountDifference = Math.abs(amount) - existingTransaction.amount;

        if (amountDifference !== 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              currentBalance: {
                increment: amountDifference,
              },
            },
          });
        }
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id: String(transactionId) },
        data: {
          description,
          amount: Math.abs(amount),
          categoryId,
          contactName,
          contactAvatar: contactAvatar || "",
          type,
          date: date ? new Date(date) : new Date(),
          isRecurring: false,
        },
      });

      return res.status(200).json({
        message: "Transaction updated successfully!",
        transaction: updatedTransaction,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: String(transactionId),
        userId: userId,
      },
      include: {
        recurringBill: true,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (existingTransaction.recurringBillId) {
      return res.status(400).json({
        message:
          "Cannot delete transactions created via 'Pay Now'. These payments are linked to recurring bills.",
      });
    }

    if (existingTransaction.isRecurring) {
      return res.status(400).json({
        message:
          "Cannot delete transactions created via 'Pay Now'. These payments are linked to recurring bills.",
      });
    }

    try {
      if (existingTransaction.type === "expense") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              increment: existingTransaction.amount,
            },
          },
        });
      } else if (existingTransaction.type === "income") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              decrement: existingTransaction.amount,
            },
          },
        });
      }

      await prisma.transaction.delete({
        where: { id: String(transactionId) },
      });

      return res.status(200).json({
        message: "Transaction deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);

      if (
        error instanceof Error &&
        "code" in error &&
        (error as any).code === "P2025"
      ) {
        return res.status(200).json({
          message: "Transaction already deleted or not found",
        });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
