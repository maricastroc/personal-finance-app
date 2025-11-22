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
      isRecurring,
      recurrenceDay,
      recurrenceFrequency,
      date,
    } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    if (!categoryName || !amount || !contactName || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["income", "expense", "transfer"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
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
      const result = await prisma.$transaction(async (tx) => {
        const updatedTransaction = await tx.transaction.update({
          where: { id: String(transactionId) },
          data: {
            description,
            amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
            categoryId,
            contactName,
            contactAvatar: contactAvatar || "",
            type,
            date: date ? new Date(date) : new Date(),
          },
        });

        if (isRecurring) {
          if (!recurrenceDay || !recurrenceFrequency) {
            throw new Error(
              "Missing recurrence fields for recurring transaction"
            );
          }

          if (existingTransaction.recurringBillId) {
            await tx.recurringBill.update({
              where: { id: existingTransaction.recurringBillId },
              data: {
                description,
                amount:
                  type === "expense" ? -Math.abs(amount) : Math.abs(amount),
                recurrenceDay,
                recurrenceFrequency,
                categoryId,
                contactName,
                contactAvatar: contactAvatar || "",
                type,
              },
            });

            if (!existingTransaction.isRecurring) {
              await tx.transaction.update({
                where: { id: String(transactionId) },
                data: { isRecurring: true },
              });
            }
          } else {
            const recurringBill = await tx.recurringBill.create({
              data: {
                description,
                amount:
                  type === "expense" ? -Math.abs(amount) : Math.abs(amount),
                recurrenceDay,
                recurrenceFrequency,
                categoryId,
                contactName,
                contactAvatar: contactAvatar || "",
                type,
                userId,
              },
            });

            await tx.transaction.update({
              where: { id: String(transactionId) },
              data: {
                recurringBillId: recurringBill.id,
                isRecurring: true,
              },
            });
          }
        } else {
          if (existingTransaction.recurringBillId) {
            await tx.transaction.update({
              where: { id: String(transactionId) },
              data: {
                recurringBillId: null,
                isRecurring: false,
              },
            });

            const otherTransactions = await tx.transaction.count({
              where: {
                recurringBillId: existingTransaction.recurringBillId,
                NOT: { id: String(transactionId) },
              },
            });

            if (otherTransactions === 0) {
              await tx.recurringBill.delete({
                where: { id: existingTransaction.recurringBillId },
              });
            }
          }
        }

        return updatedTransaction;
      });

      return res.status(200).json({
        message: "Transaction updated successfully",
        transaction: result,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);

      if (
        error instanceof Error &&
        error.message.includes("Missing recurrence fields")
      ) {
        return res.status(400).json({
          message: "Missing recurrence fields for recurring transaction",
        });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
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

    try {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.delete({
          where: { id: String(transactionId) },
        });

        if (existingTransaction.recurringBillId) {
          const otherTransactions = await tx.transaction.count({
            where: {
              recurringBillId: existingTransaction.recurringBillId,
            },
          });

          if (otherTransactions === 0) {
            await tx.recurringBill.delete({
              where: { id: existingTransaction.recurringBillId },
            });
          }
        }
      });

      return res.status(200).json({
        message: "Transaction deleted successfully",
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
  }
}
